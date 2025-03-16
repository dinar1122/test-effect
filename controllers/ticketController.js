const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const TicketController = {
    //создание тикета
    createTicket: async (req, res) => {

        const { subject, description } = req.body;
        try {
            const ticket = await prisma.ticket.create({
                data: { subject, description, status: 'NEW' }
            });
            res.json(ticket);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    //статус: в работе
    takeTicketInWork: async (req, res) => {

        const { id } = req.params;
        try {
            const ticket = await prisma.ticket.update({
                where: { id: Number(id) },
                data: { status: 'IN_PROGRESS' }
            });
            res.json(ticket);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    //статус: завершен
    completeTicket: async (req, res) => {
        const { id } = req.params;
        const { resolution } = req.body;
        try {
            const ticket = await prisma.ticket.update({
                where: { id: Number(id) },
                data: { status: 'COMPLETED', resolution }
            });
            res.json(ticket);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    //статус: отмена
    cancelTicket: async (req, res) => {
        const { id } = req.params;
        const { reason } = req.body;
        try {
            const ticket = await prisma.ticket.update({
                where: { id: Number(id) },
                data: { status: 'CANCELLED', cancellationReason: reason }
            });
            res.json(ticket);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    //список обращений с фильтрацией по дате
    getTickets: async (req, res) => {
        const { date, startDate, endDate } = req.query;
        let where = {};
        if (date) {
            const dateOnly = new Date(date);
            dateOnly.setHours(0, 0, 0, 0)
            where.createdAt = {
                gte: dateOnly,
                lt: new Date(dateOnly.getTime() + 24 * 60 * 60 * 1000)
        };
        }

        if (startDate && endDate) where.createdAt = { gte: new Date(startDate), lte: new Date(endDate) }//или диапазону дат
        try {
            const tickets = await prisma.ticket.findMany({ where });
            res.json(tickets);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    //отмена обращений со статусом "В работе"
    cancelAllInProgress: async (req, res) => {
        try {
            const updated = await prisma.ticket.updateMany({
                where: { status: 'IN_PROGRESS' },
                data: { status: 'CANCELLED', cancellationReason: 'resolved' }
            });
            res.json(updated);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = { TicketController};
