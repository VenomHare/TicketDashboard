
# VenomHare Tickets Dashboard


This is a basic Ticket System made for Support Team to manage User Complaints, Queries or any service Providable


## Packages
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white) ![Static Badge](https://img.shields.io/badge/Next-black?logo=nextdotjs) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB) ![Static Badge](https://img.shields.io/badge/React%20Icons-grey?logo=react&logoColor=orange) ![Static Badge](https://img.shields.io/badge/Styled%20Components-black?logo=styledcomponents&logoColor=pink) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat&logo=mongodb&logoColor=white) ![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=flat&logo=vercel&logoColor=white) ![Static Badge](https://img.shields.io/badge/Discord%200Auth-7289DA?style=flat&logo=discord&logoColor=7289DA&labelColor=v&color=2C2F33&link=https%3A%2F%2Fdiscordapp.com%2Fusers%2F724273091785523271)


## Licenses

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/) [![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/) [![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)


## 🚀 About Me
I'm a full stack developer...

![Static Badge](https://img.shields.io/badge/Paypal-black?style=for-the-badge&logo=paypal&link=https%3A%2F%2Fpaypal.me%2Fsarthakk1111) ![Static Badge](https://img.shields.io/badge/Instagram-black?style=for-the-badge&logo=instagram&labelColor=v&link=https%3A%2F%2Finstagram.com%2Fsarthak.1111) ![Static Badge](https://img.shields.io/badge/Twitter-black?style=for-the-badge&logo=x&labelColor=v&link=https%3A%2F%2Fx.com%2Fsarthak00dev) ![Static Badge](https://img.shields.io/badge/LinkedIn-black?style=for-the-badge&logo=linkedin&link=www.linkedin.com%2Fin%2Fsarthak00dev) ![Static Badge](https://img.shields.io/badge/Discord-black?style=for-the-badge&logo=discord&link=https%3A%2F%2Fdiscordapp.com%2Fusers%2F724273091785523271)



# Showcase

### User Login

This project uses the Discord OAuth2 System for User Authentication and Login. You must have a Discord account to access the Tickets Dashboard.

#### Logs
Once a user logs in for the first time or logs back in, a log will be sent to the Discord server.

![User Login](https://res.cloudinary.com/dzgbkv34a/image/upload/v1734773796/userlogin_t1yrgt.gif)

### User Navigation Flow

Here is a simplified flow of how a user interacts with the system:

1. **Login**: Authenticate using Discord OAuth2.
2. **Create Ticket**: Access the "Create Ticket" button to open a form.
3. **Send Messages**: Engage in a conversation with ticket support.
4. **Ticket Closure**: Admin closes the ticket when resolved.

### Creating a Ticket

> To create a ticket, the user must be logged in.

The form for creating a ticket will appear after clicking the "Create Ticket" button. The form is fully customizable. For the demo, a "Reason" field is added.

#### Logs
Once a user creates a ticket, a log will be sent to the Discord server.

![Create Ticket Video](https://res.cloudinary.com/dzgbkv34a/image/upload/v1734771662/createTicket_dxwgxg.gif)

![Create a Ticket Log](https://res.cloudinary.com/dzgbkv34a/image/upload/v1734774530/createTicketLog_xwxbl6.png)

### Ticket Messages

**Features:**

- **Emoji Support**: Emojis from the emoji picker are supported in messages.
- **Image Preview**: When a user sends a link ending with `.png`, `.gif`, `.jpg`, etc., an image preview will appear in the chat message. A maximized view of the image will appear when clicking the preview.
- **Link Previews**: Links sent in messages will display an Open Graph preview in the chat. When clicked, a redirect warning will appear.

#### Logs
Once a message is sent, a log will be sent to the Discord server.

Screenshots:
![user messages 1](https://res.cloudinary.com/dzgbkv34a/image/upload/v1734775622/userMessages1_ojfami.png) ![user messages 2](https://res.cloudinary.com/dzgbkv34a/image/upload/v1734775621/userMessages2_seoecj.png) ![user messages 3](https://res.cloudinary.com/dzgbkv34a/image/upload/v1734775622/userMessages3_bsgwlb.png) ![user messages 4](https://res.cloudinary.com/dzgbkv34a/image/upload/v1734775622/userMessages4_jqswh0.png)

Logs:
![Log screenshot](https://res.cloudinary.com/dzgbkv34a/image/upload/v1734776191/Screenshot_2024-12-21_154426_q34pki.png)

### Admin Login

The admin login process is identical to the user login process. However, an admin role is required in the Dashboard Discord Server to create an admin account.

#### Logs
Once an admin logs in for the first time or logs back in, a log will be sent to the Discord server.

![Admin Login](https://res.cloudinary.com/dzgbkv34a/image/upload/v1734775998/adminLogin_sxurfr.gif)

![Logs Screenshot](https://res.cloudinary.com/dzgbkv34a/image/upload/v1734776297/Screenshot_2024-12-21_154619_qzuyzd.png)

### Closing a Ticket

Once a conversation has ended, an admin can close the ticket.

To close a ticket:

1. Log in with an admin account.
2. Open the ticket and click the "Close Ticket" button.
3. Enter the ticket ID in the confirmation field and click "Confirm" to close the ticket.

When a ticket is closed:
- A user can neither send nor delete messages.
- Only an admin can send messages.

![Closing Ticket Message](https://res.cloudinary.com/dzgbkv34a/image/upload/v1734777059/closeTicket_psrkeq.gif)

Logs:
![Logs Screenshot](https://res.cloudinary.com/dzgbkv34a/image/upload/v1734777180/Screenshot_2024-12-21_160105_kssk16.png)

### Security Measures

To ensure user and system safety:
- OAuth2 is securely implemented for user authentication.
- Logs provide transparency and accountability for user actions.
- A redirect warning for external links helps prevent phishing or malicious redirection.

### Accessibility and Compatibility

- The dashboard is mobile-compatible and works across different devices.
- Supports accessibility features like high-contrast mode and keyboard navigation.

### Technologies Used

- **Frontend**: Built with modern web technologies for a responsive and user-friendly interface.
- **Backend**: Utilizes Discord OAuth2 for authentication and secure communication with the server.
- **Logging**: Integrated logging system for monitoring user activities and actions.

This project is designed to provide an intuitive and secure user experience while maintaining robust administrative controls.


## Feedback

If you have any feedback, please reach out to us via mail or Discord

##### Email Id : venomhare9@gmail.com

##### Discord Id : venomhare

##
##### 

![Logo](https://res.cloudinary.com/dzgbkv34a/image/upload/v1734779020/TicketDashboard_or6mv0.png)

