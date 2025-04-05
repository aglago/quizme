// app/lib/db/models/User.ts
import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  bio: string;
  createdAt: Date;
  lastLogin?: Date;
  preferences: {
    darkMode: boolean;
    notifications: boolean;
    studyReminders: boolean;
  };
  subscription: {
    plan: string;
    startDate?: Date;
    endDate?: Date;
  };
  resetToken?: string;
  resetTokenExpiry?: Date;
  savedDocuments: mongoose.Types.ObjectId[]; // Added savedDocuments field
  comparePassword: (password: string) => Promise<boolean>;
}

interface UserModel extends Model<IUser> {
  // Authentication methods
  findByEmail(email: string): Promise<IUser | null>;
  findByCredentials(email: string, password: string): Promise<IUser | null>;
  
  // User creation and management
  createUser(userData: {
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    preferences?: Partial<IUser['preferences']>,
  }): Promise<IUser>;
  
  // User updates
  updateProfile(userId: string, profileData: {
    firstName?: string,
    lastName?: string,
    email?: string,
  }): Promise<IUser | null>;
  
  // Preferences management
  updatePreferences(userId: string, preferences: Partial<IUser['preferences']>): Promise<IUser | null>;
  
  // Subscription management
  updateSubscription(userId: string, subscription: {
    plan: string,
    startDate?: Date,
    endDate?: Date,
  }): Promise<IUser | null>;
  
  // Password management
  changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean>;
  resetPasswordRequest(email: string): Promise<string | null>; // Returns reset token
  resetPassword(token: string, newPassword: string): Promise<boolean>;
  
  // Activity tracking
  recordLogin(userId: string): Promise<void>;
  
  // Analytics helpers
  getActiveUsers(days: number): Promise<{ count: number, users: IUser[] }>;
  getUsersBySubscriptionPlan(plan: string): Promise<{ count: number, users: IUser[] }>;

  // Add saved document functionality
  saveDocument(userId: string, documentId: string): Promise<IUser | null>;
  unsaveDocument(userId: string, documentId: string): Promise<IUser | null>;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  firstName: String,
  lastName: String,
  bio: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: Date,
  preferences: {
    darkMode: {
      type: Boolean,
      default: false,
    },
    notifications: {
      type: Boolean,
      default: true,
    },
    studyReminders: {
      type: Boolean,
      default: true,
    },
  },
  subscription: {
    plan: {
      type: String,
      default: 'free',
      enum: ['free', 'basic', 'premium', 'enterprise'],
     },
    startDate: Date,
    endDate: Date,
  },
  // comparePassword: {
  //   type: Function,
  //   required: true
  // },
  resetToken: String,
  resetTokenExpiry: Date,
  savedDocuments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
  }],
});

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
  if (this.isModified('passwordHash')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

// Static methods implementation
UserSchema.statics.findByEmail = async function(email: string): Promise<IUser | null> {
  return this.findOne({ email: email.toLowerCase() });
};

UserSchema.statics.findByCredentials = async function(email: string, password: string): Promise<IUser | null> {
  const user = await this.findOne({ email: email.toLowerCase() });
  
  if (!user) {
    return null;
  }
  
  const isPasswordValid = await user.comparePassword(password);
  
  if (!isPasswordValid) {
    return null;
  }
  
  return user;
};

UserSchema.statics.createUser = async function(userData: {
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
  preferences?: Partial<IUser['preferences']>,
}): Promise<IUser> {
  const user = new this({
    email: userData.email.toLowerCase(),
    passwordHash: userData.password, // Will be hashed by pre-save hook
    firstName: userData.firstName,
    lastName: userData.lastName,
    preferences: {
      ...{
        darkMode: false,
        notifications: true,
        studyReminders: true,
      },
      ...userData.preferences,
    },
    subscription: {
      plan: 'free',
    },
  });
  
  await user.save();
  return user;
};

UserSchema.statics.updateProfile = async function(
  userId: string,
  profileData: {
    firstName?: string,
    lastName?: string,
    email?: string,
  }
): Promise<IUser | null> {
  const updateData: Record<string, string> = {};
  
  if (profileData.firstName !== undefined) {
    updateData.firstName = profileData.firstName;
  }
  
  if (profileData.lastName !== undefined) {
    updateData.lastName = profileData.lastName;
  }
  
  if (profileData.email !== undefined) {
    updateData.email = profileData.email.toLowerCase();
  }
  
  return this.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

UserSchema.statics.updatePreferences = async function(
  userId: string,
  preferences: Partial<IUser['preferences']>
): Promise<IUser | null> {
  const updateData: Record<string, boolean> = {};
  
  // Create dot notation for nested preferences
  Object.entries(preferences).forEach(([key, value]) => {
    if (typeof value === 'boolean') {
      updateData[`preferences.${key}`] = value;
    }
  });
  
  return this.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

UserSchema.statics.updateSubscription = async function(
  userId: string,
  subscription: {
    plan: string,
    startDate?: Date,
    endDate?: Date,
  }
): Promise<IUser | null> {
  const updateData: Record<string, string | Date> = {
    'subscription.plan': subscription.plan
  };
  
  if (subscription.startDate) {
    updateData['subscription.startDate'] = subscription.startDate;
  } else {
    updateData['subscription.startDate'] = new Date();
  }
  
  if (subscription.endDate) {
    updateData['subscription.endDate'] = subscription.endDate;
  }
  
  return this.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

UserSchema.statics.changePassword = async function(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  const user = await this.findById(userId);
  
  if (!user) {
    return false;
  }
  
  const isPasswordValid = await user.comparePassword(currentPassword);
  
  if (!isPasswordValid) {
    return false;
  }
  
  user.passwordHash = newPassword; // Will be hashed by pre-save hook
  await user.save();
  
  return true;
};

UserSchema.statics.resetPasswordRequest = async function(email: string): Promise<string | null> {
  const user = await this.findOne({ email: email.toLowerCase() });
  
  if (!user) {
    return null;
  }
  
  // Generate a secure random token using bcrypt's genSalt
  const salt = await bcrypt.genSalt(16);
  const resetToken = salt.replace(/[^a-zA-Z0-9]/g, '');
  
  // Set token expiry to 1 hour from now
  const resetTokenExpiry = new Date();
  resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);
  
  // Save the token and expiry to the user
  user.resetToken = resetToken;
  user.resetTokenExpiry = resetTokenExpiry;
  await user.save();
  
  return resetToken;
};

UserSchema.statics.resetPassword = async function(token: string, newPassword: string): Promise<boolean> {
  // Find user with this token and check if token is still valid
  const user = await this.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() } // Token not expired
  });
  
  if (!user) {
    return false;
  }
  
  // Update password and clear reset token fields
  user.passwordHash = newPassword; // Will be hashed by pre-save hook
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  
  await user.save();
  
  return true;
};

UserSchema.statics.recordLogin = async function(userId: string): Promise<void> {
  await this.findByIdAndUpdate(
    userId,
    { $set: { lastLogin: new Date() } }
  );
};

UserSchema.statics.getActiveUsers = async function(days: number): Promise<{ count: number, users: IUser[] }> {
  const date = new Date();
  date.setDate(date.getDate() - days);
  
  const users = await this.find({
    lastLogin: { $gte: date }
  });
  
  return {
    count: users.length,
    users
  };
};

UserSchema.statics.getUsersBySubscriptionPlan = async function(plan: string): Promise<{ count: number, users: IUser[] }> {
  const users = await this.find({
    'subscription.plan': plan
  });
  
  return {
    count: users.length,
    users
  };
};

UserSchema.statics.saveDocument = async function(userId: string, documentId: string): Promise<IUser | null> {
  const user = await this.findById(userId);
  if (!user) {
    return null;
  }

  // Check if the document is already saved
  if (user.savedDocuments.includes(new mongoose.Types.ObjectId(documentId))) {
    return user; // Document already saved
  }

  user.savedDocuments.push(new mongoose.Types.ObjectId(documentId));
  await user.save();
  return user;
};

UserSchema.statics.unsaveDocument = async function(userId: string, documentId: string): Promise<IUser | null> {
  const user = await this.findById(userId);
  if (!user) {
    return null;
  }

  // Remove the document from the savedDocuments array
  user.savedDocuments = user.savedDocuments.filter((docId: mongoose.Types.ObjectId) => docId.toString() !== documentId);
  await user.save();
  return user;
};

const User = (mongoose.models.User as UserModel) || 
  mongoose.model<IUser, UserModel>('User', UserSchema);

export default User;