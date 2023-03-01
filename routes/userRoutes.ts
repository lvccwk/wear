import express from 'express';
import { userController } from '../app';

export function makeUserRoutes() {
	const userRoutes = express.Router();
	userRoutes.get('/login/google', userController.loginGoogle);
	userRoutes.get('/logout', userController.logout);
	userRoutes.post('/login', userController.login);
	userRoutes.post('/register', userController.register);
	userRoutes.get('/me', userController.getSessionProfile);
	userRoutes.get('/profile', userController.getUserProfile);
	userRoutes.put('/update', userController.putUserProfile);
	return userRoutes;
}

// userRoutes.post("/register", register);

// async function register(req: express.Request, res: express.Response) {
//     try {
//         let {email, password} = req.body;

//         if (!password || !email) {
//             res.status(402).json({
//                 message: "Invalid input",
//             });
//             return;
//         }

//         let user = (await client.query(`SELECT * FROM users WHERE users.email = $1`, [email])).rows[0];

//         if (user) {
//             res.status(402).json({
//                 message: "Your email has been registered",
//             });
//             return;
//         } else {
//             let hashedPassword = await hashPassword(crypto.randomUUID());
//             user = (
//                 await client.query(`INSERT INTO users (email, password, created_at, updated_at) values ($1,$2,now(),now()) RETURNING *`, [
//                     email,
//                     hashedPassword,
//                 ])
//             ).rows[0];
//         }

//         delete user.password;
//         req.session.user = {
//             email: user.email,
//             id: user.id,
//             display_name: user.display_name,
//         };

//         res.json("ok");
//     } catch (error) {
//         logger.error(error);
//         res.status(500).json({
//             message: "[USR002] - Server error",
//         });
//     }
// }

// async function login(req: express.Request, res: express.Response) {
//     try {
//         logger.info("body = ", req.body);
//         let {email, password} = req.body;
//         if (!email || !password) {
//             res.status(402).json({
//                 message: "Invalid input",
//             });
//             return;
//         }

//         let selectUserResult = await client.query(`select * from users where email = $1 `, [email]);

//         let foundUser = selectUserResult.rows[0];
//         console.log("foundUser", foundUser);
//         if (!foundUser) {
//             res.status(402).json({
//                 message: "Invalid email",
//             });
//             return;
//         }

//         if (foundUser.password !== password) {
//             res.status(402).json({
//                 message: "Invalid password",
//             });
//             return;
//         }

//         let isPasswordValid = await checkPassword(password, foundUser.password);

//         if (isPasswordValid) {
//             res.status(402).json({
//                 message: "Invalid password",
//             });
//             return;
//         }

//         delete foundUser.password;

//         req.session.user = {
//             email: foundUser.email,
//             id: foundUser.id,
//             display_name: foundUser.display_name,
//         };

//         console.log(`check req.session.user`, req.session.user);

//         res.redirect("/chatroom.html");
//     } catch (error) {
//         logger.error(error);
//         res.status(500).json({
//             message: "[USR001] - Server error",
//         });
//     }
// }

// async function loginGoogle(req: express.Request, res: express.Response) {
//     try {
//         const accessToken = req.session?.["grant"].response.access_token;
//         const fetchRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
//             method: "get",
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             },
//         });

//         const googleUserProfile = await fetchRes.json();
//         let user = (await client.query(`SELECT * FROM users WHERE users.email = $1`, [googleUserProfile.email])).rows[0];

//         if (!user) {
//             let hashedPassword = await hashPassword(crypto.randomUUID());

//             let emailPrefix = googleUserProfile.email.split("@")[0];

//             user = (
//                 await client.query(
//                     `INSERT INTO users
// 						(display_name, email, password, created_at, updated_at)
// 						VALUES ($1,$2,$3, now(),now()) RETURNING *`,
//                     [emailPrefix, googleUserProfile.email, hashedPassword]
//                 )
//             ).rows[0];
//         }

//         req.session["user"] = user;

//         // console.log("loading google login");
//         return res.redirect("/chatroom.html");
//     } catch (error) {
//         logger.error(error);
//         res.status(500).json({
//             message: "[USR003] - Server error",
//         });
//     }
// }
