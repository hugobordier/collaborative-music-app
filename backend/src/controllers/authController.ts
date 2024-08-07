import { Request, Response } from 'express';
import User from '../models/User';

export const login = async (req: Request, res: Response) => {
  const { access_token, refresh_token } = req.body;
  
  // Utiliser access_token pour obtenir les informations utilisateur de Spotify
  // Enregistrer/Mettre à jour l'utilisateur dans la base de données
  res.json({ message: 'Login successful', access_token, refresh_token });
};
