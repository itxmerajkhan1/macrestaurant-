import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AuditLog } from '../types';

export const logAdminAction = async (
  adminId: string,
  adminEmail: string,
  actionType: AuditLog['actionType'],
  targetId: string,
  details: string
) => {
  try {
    const auditRef = collection(db, 'admin_audit_log');
    await addDoc(auditRef, {
      adminId,
      adminEmail,
      actionType,
      targetId,
      details,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
};
