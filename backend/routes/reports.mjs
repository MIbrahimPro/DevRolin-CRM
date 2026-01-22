import express from 'express';
import Attendance from '../models/Attendance.mjs';
import Task from '../models/Task.mjs';
import Leave from '../models/Leave.mjs';
import Employee from '../models/Employee.mjs';
import Project from '../models/Project.mjs';
import { protect, authorize } from '../middlewares/auth.mjs';
import XLSX from 'xlsx';
import PDFDocument from 'pdfkit';

const router = express.Router();

// @route   GET /api/reports/weekly
// @desc    Get weekly report
router.get('/weekly', protect, authorize('admin', 'hr', 'pm'), async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate || Date.now());
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start of week
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    const attendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    }).populate('employee');

    const tasks = await Task.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate('project assignedTo');

    const leaves = await Leave.find({
      startDate: { $lte: endDate },
      endDate: { $gte: startDate }
    }).populate('employee');

    res.json({
      period: { startDate, endDate },
      attendance: {
        total: attendance.length,
        present: attendance.filter(a => a.status === 'present').length,
        absent: attendance.filter(a => a.status === 'absent').length
      },
      tasks: {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'completed').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length
      },
      leaves: {
        total: leaves.length,
        approved: leaves.filter(l => l.status === 'approved').length,
        pending: leaves.filter(l => l.status === 'pending').length
      },
      details: {
        attendance,
        tasks,
        leaves
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reports/monthly
// @desc    Get monthly report
router.get('/monthly', protect, authorize('admin', 'hr', 'pm'), async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth();
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const attendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    }).populate('employee');

    const tasks = await Task.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate('project assignedTo');

    const leaves = await Leave.find({
      startDate: { $lte: endDate },
      endDate: { $gte: startDate }
    }).populate('employee');

    const projects = await Project.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate('pm client');

    res.json({
      period: { startDate, endDate, month, year },
      attendance: {
        total: attendance.length,
        present: attendance.filter(a => a.status === 'present').length,
        absent: attendance.filter(a => a.status === 'absent').length,
        byEmployee: attendance.reduce((acc, a) => {
          const empId = a.employee._id.toString();
          acc[empId] = (acc[empId] || 0) + 1;
          return acc;
        }, {})
      },
      tasks: {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'completed').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        byProject: tasks.reduce((acc, t) => {
          const projId = t.project._id.toString();
          acc[projId] = (acc[projId] || 0) + 1;
          return acc;
        }, {})
      },
      leaves: {
        total: leaves.length,
        approved: leaves.filter(l => l.status === 'approved').length,
        pending: leaves.filter(l => l.status === 'pending').length
      },
      projects: {
        total: projects.length,
        active: projects.filter(p => p.status === 'active').length,
        completed: projects.filter(p => p.status === 'completed').length
      },
      details: {
        attendance,
        tasks,
        leaves,
        projects
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reports/export/xlsx
// @desc    Export report to Excel
router.get('/export/xlsx', protect, authorize('admin', 'hr', 'pm'), async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    
    let data = [];
    if (type === 'attendance') {
      const attendance = await Attendance.find({
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }).populate('employee');
      
      data = attendance.map(a => ({
        Date: a.date.toISOString().split('T')[0],
        Employee: a.employee.firstName + ' ' + a.employee.lastName,
        'Check In': a.checkIn.time,
        'Check Out': a.checkOut?.time || 'N/A',
        Status: a.status
      }));
    } else if (type === 'tasks') {
      const tasks = await Task.find({
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }).populate('project assignedTo');
      
      data = tasks.map(t => ({
        Title: t.title,
        Project: t.project.name,
        'Assigned To': t.assignedTo.map(e => e.firstName + ' ' + e.lastName).join(', '),
        Status: t.status,
        'Created At': t.createdAt
      }));
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reports/export/pdf
// @desc    Export report to PDF
router.get('/export/pdf', protect, authorize('admin', 'hr', 'pm'), async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
    doc.pipe(res);

    doc.fontSize(20).text('DevRolin CRM Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Period: ${startDate} to ${endDate}`);
    doc.moveDown();

    if (type === 'attendance') {
      const attendance = await Attendance.find({
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }).populate('employee');

      doc.fontSize(16).text('Attendance Report');
      doc.moveDown();
      
      attendance.forEach(a => {
        doc.fontSize(10).text(
          `${a.date.toISOString().split('T')[0]} - ${a.employee.firstName} ${a.employee.lastName} - ${a.status}`
        );
      });
    }

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


