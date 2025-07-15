import { Resend } from 'resend';

const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY || "re_SaKHEoaA_DTs5dkH1Wte3AyRqsABxAQx5";
  return new Resend(apiKey);
};

export interface WinnerEmailData {
  userEmail: string;
  userName: string;
  prizeName: string;
  prizeValue: string;
  phoneNumber: string;
}

export const createWinnerEmailTemplate = (data: WinnerEmailData) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎉 Congratulations! You're a Winner!</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Montserrat', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #2C5CDC 0%, #F76D46 100%);
            padding: 30px 20px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="30" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="70" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="80" r="2.5" fill="rgba(255,255,255,0.1)"/></svg>');
        }
        
        .logo-container {
            background-color: #ffffff;
            padding: 15px;
            border-radius: 12px;
            display: inline-block;
            margin-bottom: 20px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            position: relative;
            z-index: 1;
        }
        
        .logo {
            height: 60px;
            width: auto;
        }
        
        .header-title {
            color: #ffffff;
            font-size: 28px;
            font-weight: 800;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            position: relative;
            z-index: 1;
        }
        
        .header-subtitle {
            color: #ffffff;
            font-size: 16px;
            font-weight: 600;
            position: relative;
            z-index: 1;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .trophy-section {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .trophy {
            font-size: 60px;
            margin-bottom: 15px;
            animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
        
        .celebration-text {
            font-size: 24px;
            font-weight: 700;
            color: #2C5CDC;
            margin-bottom: 15px;
        }
        
        .winner-name {
            font-size: 20px;
            font-weight: 600;
            color: #333;
            margin-bottom: 30px;
        }
        
        .prize-card {
            background: linear-gradient(135deg, #f8f9ff 0%, #e8f5e8 100%);
            border: 3px solid #2C5CDC;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .prize-card::before {
            content: '🎁';
            position: absolute;
            top: -10px;
            right: -10px;
            font-size: 40px;
            opacity: 0.1;
        }
        
        .prize-title {
            font-size: 18px;
            font-weight: 700;
            color: #2C5CDC;
            margin-bottom: 10px;
        }
        
        .prize-description {
            font-size: 16px;
            color: #555;
            margin-bottom: 15px;
            line-height: 1.5;
        }
        
        .prize-value {
            font-size: 24px;
            font-weight: 800;
            color: #F76D46;
            background-color: #ffffff;
            padding: 10px 20px;
            border-radius: 25px;
            display: inline-block;
            box-shadow: 0 3px 10px rgba(247, 109, 70, 0.2);
        }
        
        .claim-section {
            background: linear-gradient(135deg, #2C5CDC 0%, #1a4bc4 100%);
            color: #ffffff;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 30px;
        }
        
        .claim-title {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 15px;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .claim-instruction {
            font-size: 16px;
            margin-bottom: 20px;
            line-height: 1.5;
        }
        
        .phone-container {
            background-color: #ffffff;
            color: #2C5CDC;
            padding: 15px 25px;
            border-radius: 8px;
            display: inline-block;
            margin-bottom: 15px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }
        
        .phone-number {
            font-size: 28px;
            font-weight: 800;
            margin: 0;
        }
        
        .urgency-text {
            font-size: 14px;
            color: #ffb22a;
            font-weight: 600;
            margin-top: 10px;
        }
        
        .important-notes {
            background-color: #fff8dc;
            border-left: 4px solid #ffb22a;
            padding: 20px;
            margin-bottom: 30px;
            border-radius: 0 8px 8px 0;
        }
        
        .important-notes h3 {
            color: #F76D46;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .important-notes ul {
            list-style: none;
            padding-left: 0;
        }
        
        .important-notes li {
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
            font-size: 14px;
            color: #555;
        }
        
        .important-notes li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #2C5CDC;
            font-weight: bold;
        }
        
        .footer {
            background-color: #ffb22a;
            color: #333;
            text-align: center;
            padding: 25px;
        }
        
        .footer-content {
            background-color: #000;
            color: #fff;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 15px;
        }
        
        .footer-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 5px;
        }
        
        .footer-subtitle {
            font-size: 14px;
            font-weight: 600;
        }
        
        .company-info {
            font-size: 12px;
            color: #333;
            font-weight: 600;
        }
        
        .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: #F76D46;
            animation: confetti-fall 3s linear infinite;
        }
        
        @keyframes confetti-fall {
            0% {
                transform: translateY(-100px) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100px) rotate(360deg);
                opacity: 0;
            }
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 0 10px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .header-title {
                font-size: 24px;
            }
            
            .celebration-text {
                font-size: 20px;
            }
            
            .phone-number {
                font-size: 24px;
            }
            
            .prize-value {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header with Logo and Branding -->
        <div class="header">
            <div class="logo-container">
                <img src="https://your-domain.com/logo.png" alt="Done For You Pros" class="logo">
            </div>
            <h1 class="header-title">🎉 CONGRATULATIONS! 🎉</h1>
            <p class="header-subtitle">You're a Winner in Our Scratch & Win Game!</p>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <!-- Trophy Section -->
            <div class="trophy-section">
                <div class="trophy">🏆</div>
                <h2 class="celebration-text">WINNER WINNER!</h2>
                <p class="winner-name">Dear ${data.userName},</p>
            </div>
            
            <!-- Prize Information -->
            <div class="prize-card">
                <h3 class="prize-title">🎁 YOUR WINNING PRIZE</h3>
                <p class="prize-description">${data.prizeName}</p>
                <div class="prize-value">${data.prizeValue}</div>
            </div>
            
            <!-- Claim Instructions -->
            <div class="claim-section">
                <h3 class="claim-title">🔥 CLAIM YOUR PRIZE NOW!</h3>
                <p class="claim-instruction">
                    Call us immediately to claim your prize and schedule your installation!
                </p>
                <div class="phone-container">
                    <p class="phone-number">📞 ${data.phoneNumber}</p>
                </div>
                <p class="urgency-text">⏰ Call now to secure your prize!</p>
            </div>
            
            <!-- Important Notes -->
            <div class="important-notes">
                <h3>📋 Important Information:</h3>
                <ul>
                    <li>Have your winning confirmation email ready when you call</li>
                    <li>Prize must be claimed within 30 days of winning</li>
                    <li>Installation will be scheduled at your convenience</li>
                    <li>All parts and labor included in your prize value</li>
                    <li>Professional installation by certified technicians</li>
                </ul>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-content">
                <p class="footer-title">Our 20 Connection New Parts Installations Program</p>
                <p class="footer-subtitle">is already Protecting 300,000+ Home Owners nationwide</p>
            </div>
            <p class="company-info">© 2025 Done For You Pros. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
};

export const sendWinnerEmail = async (data: WinnerEmailData): Promise<boolean> => {
  try {
    const resend = getResend();
    const { data: result, error } = await resend.emails.send({
      from: 'prizes@doneforyoupros.com',
      to: data.userEmail,
      subject: '🎉 Congratulations! You Won a Prize from Done For You Pros!',
      html: createWinnerEmailTemplate(data),
    });

    if (error) {
      console.error('Error sending winner email:', error);
      return false;
    }

    console.log('Winner email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send winner email:', error);
    return false;
  }
};

export const sendTestEmail = async (testEmail: string): Promise<boolean> => {
  const testData: WinnerEmailData = {
    userEmail: testEmail,
    userName: 'Test Winner',
    prizeName: 'Dishwasher New Water Valve Installation',
    prizeValue: '$591',
    phoneNumber: '(310) 295-6355'
  };

  return await sendWinnerEmail(testData);
};