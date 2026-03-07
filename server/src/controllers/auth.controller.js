import { User } from "../models/user.model.js";

export const authCallback = async (req, res, next) => {
    try {
        const { id, firstName, lastName, imageUrl } = req.auth.user;
        const fullName = `${firstName || ""} ${lastName || ""}`.trim();
        let user = await User.findOne({ clerkId: id });
        if (!user) {
            await User.create({ fullName, imageUrl, clerkId: id });
        }
        res.status(200).json({ message: "Authentication successful" });
    } catch (error) {
        console.error("Error in auth callback:", error);
        res.status(500).json({ message: "Internal Server Error" });
        next(error);
    }
};