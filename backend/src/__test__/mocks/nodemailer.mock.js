// start of backend/src/__test__/mocks/nodemailer.mock.js
const nodemailer = {
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn().mockResolvedValue({
        messageId: 'test-message-id'
      })
    })
  };
  
  module.exports = nodemailer;
  // end of backend/src/__test__/mocks/nodemailer.mock.js