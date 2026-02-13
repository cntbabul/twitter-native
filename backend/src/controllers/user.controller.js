import asyncHandler from "express-async-handler";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

import { clerkClient, getAuth } from "@clerk/express";

// export const getUserProfile = asyncHandler(async (req, res) => {
//     const { username } = req.params;
//     const user = await User.findOne({ username });
//     if (!user) {
//         return res.status(404).json({ error: "User not found" });
//     }
//     res.status(200).json(user);
// });
export const getUserProfile = asyncHandler(async (req, res) => {
    const { username } = req.params; // FIXED: Destructuring
    const user = await User.findOne({ username }).select("-password"); // Best practice: exclude sensitive fields if any
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
});

export const updateProfile = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { firstName, lastName, bio, profilePicture } = req.body; // whitelist allowed fields
    const user = await User.findOneAndUpdate(
        { clerkId: userId },
        { firstName, lastName, bio, profilePicture },
        { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
});

export const syncUser = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { email, name, image } = req.body;

    //check user if already exist 
    const existingUser = await User.findOne({ clerkId: userId });
    if (existingUser) {
        return res.status(200).json({ user: existingUser, message: "User already exists" });
    }

    let userData = {
        clerkId: userId,
        email,
        firstName: name ? name.split(' ')[0] : "",
        lastName: name ? name.split(' ').slice(1).join(' ') : "",
        username: email ? email.split('@')[0] : userId,
        profilePicture: image,
    };

    if (!email || !name) {
        // Fallback to fetching from Clerk if body is missing data
        try {
            const clerkUser = await clerkClient.users.getUser(userId);
            userData = {
                clerkId: userId,
                email: clerkUser.emailAddresses[0].emailAddress,
                firstName: clerkUser.firstName || "",
                lastName: clerkUser.lastName || "",
                username: clerkUser.emailAddresses?.[0]?.emailAddress?.split('@')[0] || clerkUser.id,
                profilePicture: clerkUser.imageUrl || "",
            };
        } catch (error) {
            console.error("Error fetching user from Clerk:", error);
            return res.status(500).json({ error: "Failed to sync user data" });
        }
    }

    // Ensure strictly required fields are present (schema requires firstName, lastName, username, email)
    // If name was single word, lastName might be empty. Handle this.
    if (!userData.lastName) userData.lastName = userData.firstName; // Fallback or leave empty? Schema says required.

    // Handle duplicate username edge case
    const usernameExists = await User.findOne({ username: userData.username });
    if (usernameExists) {
        userData.username = `${userData.username}_${Math.floor(Math.random() * 1000)}`;
    }

    const user = await User.create(userData);
    res.status(201).json({ user, message: "User created successfully" });
})
export const getCurrentUser = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ user });
})
export const followUser = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { targetUserId } = req.params;
    if (userId === targetUserId) return res.status(400).json({ error: "You can not follow Yourself" })
    const currentUser = await User.findOne({ clerkId: userId });
    const targetUser = await User.findById(targetUserId);
    if (!currentUser || !targetUser) return res.status(404).json({ error: "User not found" })

    // const isFollowing = currentUser.following.includes(targetUserId);
    // Fix:
    const isFollowing = currentUser.following.some(id => id.toString() === targetUserId);
    if (isFollowing) {
        // unfollow
        await User.findByIdAndUpdate(currentUser._id, { $pull: { following: targetUserId } },)
        await User.findByIdAndUpdate(targetUser._id, { $pull: { followers: currentUser._id } },)
    } else {
        // follow
        await User.findByIdAndUpdate(currentUser._id, { $push: { following: targetUserId } },)
        await User.findByIdAndUpdate(targetUser._id, { $push: { followers: currentUser._id } },)

        //create notification
        await Notification.create({
            from: currentUser._id,
            to: targetUser._id,
            type: "follow",

        })
    }

    res.status(200).json({ message: isFollowing ? "User unfollowed successfully" : "User followed successfully" })
})
