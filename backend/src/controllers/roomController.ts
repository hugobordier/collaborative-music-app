import { Request, Response } from 'express';
import Room from '../models/Room';

export const createRoom = async (req: Request, res: Response) => {
  const { name, ownerId } = req.body;

  try {
    const newRoom = new Room({ name, owner: ownerId, members: [ownerId] });
    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    res.status(500).json({ error: 'Error creating room' });
  }
};
