const express = require('express');

const { 
    TicketController
} = require('../controllers/ticketController');

const router = express.Router();


router.post('/', TicketController.createTicket);
router.patch('/:id/work', TicketController.takeTicketInWork); 
router.patch('/:id/complete', TicketController.completeTicket);
router.patch('/:id/cancel', TicketController.cancelTicket); 
router.get('/', TicketController.getTickets);
router.patch('/cancel-in-progress', TicketController.cancelAllInProgress);

module.exports = router
