import { Request, Response } from 'express';
import Room from '../models/Room';

export const createRoom = async (req: Request, res: Response) => {
  try {
    const newRoom = new Room(req.body);
    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    res.status(500).json({ error: 'Error creating room' });
  }
};
