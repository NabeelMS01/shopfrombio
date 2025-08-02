import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password?: string; // Password can be optional on returned objects
}

const UserSchema: Schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide a first name.'],
    maxlength: [60, 'First name cannot be more than 60 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Please provide a last name.'],
    maxlength: [60, 'Last name cannot be more than 60 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);