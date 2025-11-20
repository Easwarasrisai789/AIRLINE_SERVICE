const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: (process.env.SMTP_PASS || '').replace(/^["']|["']$/g, ''), // Remove quotes if present
  },
});

const sendBookingReceipt = async (booking) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('Email credentials missing. Receipt email skipped.');
    return;
  }

  const { passengerName, passengerEmail, seatNumbers = [], paymentReference } = booking;
  const flight = booking.flight;

  const seatList = seatNumbers.length ? seatNumbers.join(', ') : 'Auto-assigned';
  const mailOptions = {
    from: process.env.SMTP_FROM || 'no-reply@airline-app.com',
    to: passengerEmail,
    subject: `Booking Confirmation - ${flight.flightNumber}`,
    html: `
      <h2>Hi ${passengerName},</h2>
      <p>Your ticket has been confirmed. Below are the details:</p>
      <ul>
        <li><strong>Flight:</strong> ${flight.flightNumber} (${flight.origin} → ${flight.destination})</li>
        <li><strong>Departure:</strong> ${new Date(flight.departureTime).toLocaleString()}</li>
        <li><strong>Seats:</strong> ${seatList}</li>
        <li><strong>Payment Ref:</strong> ${paymentReference}</li>
        <li><strong>Status:</strong> ${booking.status}</li>
      </ul>
      <p>Thank you for choosing our airline!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendBookingReceipt };

