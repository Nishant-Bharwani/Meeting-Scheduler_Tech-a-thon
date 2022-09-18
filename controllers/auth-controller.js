const UserModel = require('../models/user-model');
class AuthController {


    async register(req, res) {
        const { email, password, isAdmin } = req.body;

        console.log(req.body, email, password);
        if (!email || !password) {
            res.status(403).send("Email and password are missing");
        }

        try {
            let user = await UserModel.findOne({ email });

            if (user) {
                return res.status(201).send(user);
            }

            user = new UserModel(req.body);
            await user.save();

            return res.status(201).send(user);


        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: true,
                message: "Cannot Sign up",
            });
        }

    }

}

module.exports = new AuthController();