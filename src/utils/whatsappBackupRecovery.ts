/**
 * WhatsApp Backup & Recovery System
 * Dale & Kirsten's Wedding RSVP System
 * 
 * Provides comprehensive backup, recovery, and disaster management
 * for WhatsApp campaign data with encryption and validation.
 */

import { createHash, randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { 
  WhatsAppGuest, 
  WhatsAppCampaign, 
  WhatsAppTemplate, 
  WhatsAppAnalytics,
  BulkTokenGeneration,
  GuestImportResult,
  TokenGenerationOptions
} from '../types/whatsapp';

interface BackupMetadata {
  version: string;
  createdAt: Date;
  createdBy: string;
  backupId: string;
  dataTypes: string[];
  recordCounts: Record<string, number>;
  encryption: {
    algorithm: string;
    keyDerivation: string;
    saltLength: number;
  };
  checksum: string;
  size: number;
  compressed: boolean;
}

interface BackupData {
  metadata: BackupMetadata;
  guests: WhatsAppGuest[];
  campaigns: WhatsAppCampaign[];
  templates: WhatsAppTemplate[];
  analytics: WhatsAppAnalytics[];
  importHistory: GuestImportResult[];
  tokenGeneration: BulkTokenGeneration[];
  configurations: Record<string, any>;
}

interface RecoveryPlan {
  backupId: string;
  targetDate: Date;
  recoverySteps: Array<{
    id: string;
    description: string;
    dataType: string;
    recordCount: number;
    dependencies: string[];
    estimatedTime: number; // minutes
    critical: boolean;
  }>;
  totalEstimatedTime: number;
  risksAndMitigation: Array<{
    risk: string;
    severity: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
}

interface BackupSchedule {
  id: string;
  name: string;
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  time: string; // HH:MM format
  daysOfWeek?: number[]; // 0-6, Sunday = 0
  dayOfMonth?: number; // 1-31
  enabled: boolean;
  retentionDays: number;
  includeData: string[];
  encryptBackups: boolean;
  compressionLevel: number; // 0-9
  lastRun?: Date;
  nextRun?: Date;
}

interface RecoveryOperation {
  id: string;
  backupId: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  currentStep: string;
  stepsCompleted: number;
  totalSteps: number;
  errors: string[];
  warnings: string[];
  recoveredCounts: Record<string, number>;
}

/**
 * WhatsApp Backup & Recovery Service
 */
export class WhatsAppBackupService {
  private backups: Map<string, BackupMetadata> = new Map();
  private schedules: Map<string, BackupSchedule> = new Map();
  private recoveryOperations: Map<string, RecoveryOperation> = new Map();
  private encryptionKey?: Buffer;

  constructor() {
    this.initializeEncryption();
  }

  /**
   * Initialize encryption for backup data
   */
  private initializeEncryption(): void {
    // In production, this would come from a secure key management system
    const masterKey = process.env.BACKUP_ENCRYPTION_KEY || 'wedding-backup-key-2024';
    this.encryptionKey = createHash('sha256').update(masterKey).digest();
  }

  /**
   * Create a comprehensive backup of all WhatsApp campaign data
   */
  async createBackup(
    data: Partial<BackupData>,
    options: {
      encrypt?: boolean;
      compress?: boolean;
      includeAnalytics?: boolean;
      includeTemplates?: boolean;
      createdBy?: string;
    } = {}
  ): Promise<{
    backupId: string;
    metadata: BackupMetadata;
    backupData?: string; // encrypted/compressed data
    size: number;
  }> {
    const backupId = this.generateBackupId();
    const timestamp = new Date();

    // Calculate record counts
    const recordCounts: Record<string, number> = {
      guests: data.guests?.length || 0,
      campaigns: data.campaigns?.length || 0,
      templates: data.templates?.length || 0,
      analytics: data.analytics?.length || 0,
      importHistory: data.importHistory?.length || 0,
      tokenGeneration: data.tokenGeneration?.length || 0,
      configurations: Object.keys(data.configurations || {}).length,
    };

    // Create backup metadata
    const metadata: BackupMetadata = {
      version: '1.0.0',
      createdAt: timestamp,
      createdBy: options.createdBy || 'system',
      backupId,
      dataTypes: Object.keys(recordCounts).filter(key => recordCounts[key] > 0),
      recordCounts,
      encryption: {
        algorithm: 'aes-256-gcm',
        keyDerivation: 'pbkdf2',
        saltLength: 16,
      },
      checksum: '',
      size: 0,
      compressed: options.compress || true,
    };

    // Prepare backup data
    const backupData: BackupData = {
      metadata,
      guests: data.guests || [],
      campaigns: data.campaigns || [],
      templates: data.templates || [],
      analytics: data.analytics || [],
      importHistory: data.importHistory || [],
      tokenGeneration: data.tokenGeneration || [],
      configurations: data.configurations || {},
    };

    // Serialize data
    let serializedData = JSON.stringify(backupData);

    // Compress if requested
    if (options.compress) {
      // In a real implementation, use a compression library like pako or node-zlib
      serializedData = this.compressData(serializedData);
    }

    // Encrypt if requested
    let encryptedData: string | undefined;
    if (options.encrypt && this.encryptionKey) {
      encryptedData = this.encryptData(serializedData);
    }

    // Calculate checksum
    const dataToHash = encryptedData || serializedData;
    metadata.checksum = createHash('sha256').update(dataToHash).digest('hex');
    metadata.size = dataToHash.length;

    // Store metadata
    this.backups.set(backupId, metadata);

    return {
      backupId,
      metadata,
      backupData: encryptedData || serializedData,
      size: metadata.size,
    };
  }

  /**
   * Restore data from a backup
   */
  async restoreFromBackup(
    backupId: string,
    backupData: string,
    options: {
      validateChecksum?: boolean;
      selectiveRestore?: string[]; // specific data types to restore
      dryRun?: boolean;
      overwriteExisting?: boolean;
    } = {}
  ): Promise<RecoveryOperation> {
    const metadata = this.backups.get(backupId);
    if (!metadata) {
      throw new Error(`Backup ${backupId} not found`);
    }

    const recoveryId = this.generateRecoveryId();
    const recoveryOperation: RecoveryOperation = {
      id: recoveryId,
      backupId,
      startedAt: new Date(),
      status: 'running',
      progress: 0,
      currentStep: 'Initializing recovery',
      stepsCompleted: 0,
      totalSteps: metadata.dataTypes.length + 2, // +2 for validation and finalization
      errors: [],
      warnings: [],
      recoveredCounts: {},
    };

    this.recoveryOperations.set(recoveryId, recoveryOperation);

    try {
      // Step 1: Validate checksum
      recoveryOperation.currentStep = 'Validating backup integrity';
      if (options.validateChecksum) {
        const calculatedChecksum = createHash('sha256').update(backupData).digest('hex');
        if (calculatedChecksum !== metadata.checksum) {
          throw new Error('Backup checksum validation failed - data may be corrupted');
        }
      }
      this.updateRecoveryProgress(recoveryOperation);

      // Step 2: Decrypt and decompress
      recoveryOperation.currentStep = 'Decrypting and decompressing data';
      let processedData = backupData;

      // Decrypt if needed
      if (metadata.encryption.algorithm && this.encryptionKey) {
        processedData = this.decryptData(processedData);
      }

      // Decompress if needed
      if (metadata.compressed) {
        processedData = this.decompressData(processedData);
      }

      // Parse JSON
      const restoredBackup: BackupData = JSON.parse(processedData);
      this.updateRecoveryProgress(recoveryOperation);

      // Step 3: Selective restore or full restore
      const dataTypesToRestore = options.selectiveRestore || metadata.dataTypes;

      for (const dataType of dataTypesToRestore) {
        recoveryOperation.currentStep = `Restoring ${dataType}`;
        
        if (options.dryRun) {
          recoveryOperation.recoveredCounts[dataType] = restoredBackup[dataType as keyof BackupData]?.length || 0;
          recoveryOperation.warnings.push(`Dry run: would restore ${recoveryOperation.recoveredCounts[dataType]} ${dataType}`);
        } else {
          await this.restoreDataType(dataType, restoredBackup, options.overwriteExisting || false);
          recoveryOperation.recoveredCounts[dataType] = restoredBackup[dataType as keyof BackupData]?.length || 0;
        }

        this.updateRecoveryProgress(recoveryOperation);
      }

      // Step 4: Finalization
      recoveryOperation.currentStep = 'Finalizing recovery';
      recoveryOperation.status = 'completed';
      recoveryOperation.completedAt = new Date();
      recoveryOperation.progress = 100;

    } catch (error) {
      recoveryOperation.status = 'failed';
      recoveryOperation.errors.push(error instanceof Error ? error.message : 'Unknown error');
      recoveryOperation.completedAt = new Date();
    }

    return recoveryOperation;
  }

  /**
   * Generate a recovery plan for a backup
   */
  generateRecoveryPlan(backupId: string): RecoveryPlan {
    const metadata = this.backups.get(backupId);
    if (!metadata) {
      throw new Error(`Backup ${backupId} not found`);
    }

    const steps = [];
    let totalTime = 0;

    // Define recovery steps based on data types
    const stepDefinitions = {
      templates: { time: 1, critical: false, dependencies: [] },
      configurations: { time: 1, critical: true, dependencies: [] },
      guests: { time: 5, critical: true, dependencies: ['templates'] },
      campaigns: { time: 3, critical: false, dependencies: ['guests', 'templates'] },
      analytics: { time: 2, critical: false, dependencies: ['guests', 'campaigns'] },
      importHistory: { time: 1, critical: false, dependencies: [] },
      tokenGeneration: { time: 2, critical: false, dependencies: ['guests'] },
    };

    for (const dataType of metadata.dataTypes) {
      const def = stepDefinitions[dataType as keyof typeof stepDefinitions];
      if (def) {
        const estimatedTime = Math.ceil((metadata.recordCounts[dataType] / 100) * def.time);
        
        steps.push({
          id: `restore_${dataType}`,
          description: `Restore ${dataType} data (${metadata.recordCounts[dataType]} records)`,
          dataType,
          recordCount: metadata.recordCounts[dataType],
          dependencies: def.dependencies,
          estimatedTime,
          critical: def.critical,
        });

        totalTime += estimatedTime;
      }
    }

    const risks = [
      {
        risk: 'Data conflicts with existing records',
        severity: 'medium' as const,
        mitigation: 'Use selective restore or backup existing data first',
      },
      {
        risk: 'Long recovery time affecting operations',
        severity: 'low' as const,
        mitigation: 'Schedule recovery during maintenance window',
      },
      {
        risk: 'Incomplete recovery due to dependencies',
        severity: 'high' as const,
        mitigation: 'Follow recommended step order and validate dependencies',
      },
    ];

    return {
      backupId,
      targetDate: new Date(),
      recoverySteps: steps,
      totalEstimatedTime: totalTime,
      risksAndMitigation: risks,
    };
  }

  /**
   * Schedule automated backups
   */
  createBackupSchedule(schedule: Omit<BackupSchedule, 'id' | 'lastRun' | 'nextRun'>): string {
    const scheduleId = this.generateScheduleId();
    const fullSchedule: BackupSchedule = {
      ...schedule,
      id: scheduleId,
      nextRun: this.calculateNextRun(schedule),
    };

    this.schedules.set(scheduleId, fullSchedule);
    return scheduleId;
  }

  /**
   * Execute scheduled backups
   */
  async executeScheduledBackups(): Promise<{
    executed: number;
    failed: number;
    results: Array<{ scheduleId: string; success: boolean; error?: string; backupId?: string }>;
  }> {
    const now = new Date();
    const results = [];
    let executed = 0;
    let failed = 0;

    for (const [scheduleId, schedule] of this.schedules.entries()) {
      if (!schedule.enabled || !schedule.nextRun || schedule.nextRun > now) {
        continue;
      }

      try {
        // This would fetch actual data from your data layer
        const mockData: Partial<BackupData> = {
          guests: [], // Would be populated from database
          campaigns: [],
          templates: [],
          analytics: [],
          configurations: {},
        };

        const backup = await this.createBackup(mockData, {
          encrypt: schedule.encryptBackups,
          compress: schedule.compressionLevel > 0,
          createdBy: `schedule_${schedule.name}`,
        });

        results.push({
          scheduleId,
          success: true,
          backupId: backup.backupId,
        });

        // Update schedule
        schedule.lastRun = now;
        schedule.nextRun = this.calculateNextRun(schedule);
        executed++;

      } catch (error) {
        results.push({
          scheduleId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        failed++;
      }
    }

    return { executed, failed, results };
  }

  /**
   * Clean up old backups based on retention policy
   */
  cleanupExpiredBackups(retentionDays: number = 30): {
    deletedCount: number;
    totalSize: number;
    deletedBackups: string[];
  } {
    const cutoffDate = new Date(Date.now() - (retentionDays * 24 * 60 * 60 * 1000));
    const deletedBackups: string[] = [];
    let totalSize = 0;

    for (const [backupId, metadata] of this.backups.entries()) {
      if (metadata.createdAt < cutoffDate) {
        totalSize += metadata.size;
        deletedBackups.push(backupId);
        this.backups.delete(backupId);
      }
    }

    return {
      deletedCount: deletedBackups.length,
      totalSize,
      deletedBackups,
    };
  }

  /**
   * Validate backup integrity
   */
  async validateBackup(backupId: string, backupData: string): Promise<{
    isValid: boolean;
    checksumMatch: boolean;
    dataIntegrity: boolean;
    structureValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    const metadata = this.backups.get(backupId);
    if (!metadata) {
      errors.push('Backup metadata not found');
      return {
        isValid: false,
        checksumMatch: false,
        dataIntegrity: false,
        structureValid: false,
        errors,
        warnings,
      };
    }

    // Validate checksum
    const calculatedChecksum = createHash('sha256').update(backupData).digest('hex');
    const checksumMatch = calculatedChecksum === metadata.checksum;
    if (!checksumMatch) {
      errors.push('Checksum validation failed');
    }

    let dataIntegrity = false;
    let structureValid = false;

    try {
      // Decrypt and decompress if needed
      let processedData = backupData;
      
      if (metadata.encryption.algorithm && this.encryptionKey) {
        processedData = this.decryptData(processedData);
      }

      if (metadata.compressed) {
        processedData = this.decompressData(processedData);
      }

      // Parse and validate structure
      const parsed: BackupData = JSON.parse(processedData);
      structureValid = this.validateBackupStructure(parsed);

      if (!structureValid) {
        errors.push('Backup data structure validation failed');
      }

      // Validate data integrity
      dataIntegrity = this.validateDataIntegrity(parsed, metadata);
      
      if (!dataIntegrity) {
        warnings.push('Some data integrity checks failed, but backup is still usable');
      }

    } catch (error) {
      errors.push(`Data processing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return {
      isValid: errors.length === 0,
      checksumMatch,
      dataIntegrity,
      structureValid,
      errors,
      warnings,
    };
  }

  /**
   * Get backup statistics
   */
  getBackupStatistics(): {
    totalBackups: number;
    totalSize: number;
    oldestBackup?: Date;
    newestBackup?: Date;
    backupsByType: Record<string, number>;
    averageSize: number;
    scheduledBackups: number;
    activeSchedules: number;
    failedRecoveries: number;
    successfulRecoveries: number;
  } {
    const backups = Array.from(this.backups.values());
    const recoveries = Array.from(this.recoveryOperations.values());

    const stats = {
      totalBackups: backups.length,
      totalSize: backups.reduce((sum, b) => sum + b.size, 0),
      oldestBackup: backups.length > 0 ? new Date(Math.min(...backups.map(b => b.createdAt.getTime()))) : undefined,
      newestBackup: backups.length > 0 ? new Date(Math.max(...backups.map(b => b.createdAt.getTime()))) : undefined,
      backupsByType: {} as Record<string, number>,
      averageSize: 0,
      scheduledBackups: this.schedules.size,
      activeSchedules: Array.from(this.schedules.values()).filter(s => s.enabled).length,
      failedRecoveries: recoveries.filter(r => r.status === 'failed').length,
      successfulRecoveries: recoveries.filter(r => r.status === 'completed').length,
    };

    // Calculate backup types
    backups.forEach(backup => {
      backup.dataTypes.forEach(type => {
        stats.backupsByType[type] = (stats.backupsByType[type] || 0) + 1;
      });
    });

    stats.averageSize = stats.totalBackups > 0 ? stats.totalSize / stats.totalBackups : 0;

    return stats;
  }

  // Private helper methods

  private generateBackupId(): string {
    const timestamp = Date.now().toString(36);
    const random = randomBytes(6).toString('hex');
    return `backup_${timestamp}_${random}`;
  }

  private generateRecoveryId(): string {
    const timestamp = Date.now().toString(36);
    const random = randomBytes(4).toString('hex');
    return `recovery_${timestamp}_${random}`;
  }

  private generateScheduleId(): string {
    const timestamp = Date.now().toString(36);
    const random = randomBytes(4).toString('hex');
    return `schedule_${timestamp}_${random}`;
  }

  private encryptData(data: string): string {
    if (!this.encryptionKey) throw new Error('Encryption key not available');

    const salt = randomBytes(16);
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.encryptionKey, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    // Combine salt, iv, authTag, and encrypted data
    return Buffer.concat([
      salt,
      iv,
      authTag,
      Buffer.from(encrypted, 'hex')
    ]).toString('base64');
  }

  private decryptData(encryptedData: string): string {
    if (!this.encryptionKey) throw new Error('Encryption key not available');

    const combined = Buffer.from(encryptedData, 'base64');
    const salt = combined.subarray(0, 16);
    const iv = combined.subarray(16, 28);
    const authTag = combined.subarray(28, 44);
    const encrypted = combined.subarray(44);

    const decipher = createDecipheriv('aes-256-gcm', this.encryptionKey, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, undefined, 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  private compressData(data: string): string {
    // In a real implementation, use a proper compression library
    // This is a placeholder that just returns the original data
    return data;
  }

  private decompressData(compressedData: string): string {
    // In a real implementation, use a proper decompression library
    // This is a placeholder that just returns the original data
    return compressedData;
  }

  private updateRecoveryProgress(operation: RecoveryOperation): void {
    operation.stepsCompleted++;
    operation.progress = Math.round((operation.stepsCompleted / operation.totalSteps) * 100);
  }

  private async restoreDataType(dataType: string, backupData: BackupData, overwrite: boolean): Promise<void> {
    // In a real implementation, this would interact with your data layer
    // to restore the specific data type
    console.log(`Restoring ${dataType}:`, {
      recordCount: backupData[dataType as keyof BackupData]?.length,
      overwrite,
    });
  }

  private validateBackupStructure(data: BackupData): boolean {
    // Validate required fields and structure
    return !!(
      data.metadata &&
      data.metadata.backupId &&
      data.metadata.version &&
      Array.isArray(data.guests) &&
      Array.isArray(data.campaigns)
    );
  }

  private validateDataIntegrity(data: BackupData, metadata: BackupMetadata): boolean {
    // Check if record counts match metadata
    for (const dataType of metadata.dataTypes) {
      const actualCount = data[dataType as keyof BackupData]?.length || 0;
      const expectedCount = metadata.recordCounts[dataType] || 0;
      
      if (actualCount !== expectedCount) {
        return false;
      }
    }

    return true;
  }

  private calculateNextRun(schedule: BackupSchedule): Date {
    const now = new Date();
    const nextRun = new Date(now);

    switch (schedule.frequency) {
      case 'hourly':
        nextRun.setHours(nextRun.getHours() + 1);
        break;
      case 'daily':
        const [hours, minutes] = schedule.time.split(':').map(Number);
        nextRun.setHours(hours, minutes, 0, 0);
        if (nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 1);
        }
        break;
      case 'weekly':
        // Implementation for weekly schedules
        break;
      case 'monthly':
        // Implementation for monthly schedules
        break;
    }

    return nextRun;
  }

  /**
   * Export all backups metadata for external storage
   */
  exportBackupCatalog(): string {
    const catalog = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      backups: Array.from(this.backups.values()),
      schedules: Array.from(this.schedules.values()),
      statistics: this.getBackupStatistics(),
    };

    return JSON.stringify(catalog, null, 2);
  }

  /**
   * Import backup metadata from external source
   */
  importBackupCatalog(catalogData: string): {
    importedBackups: number;
    importedSchedules: number;
    errors: string[];
  } {
    try {
      const catalog = JSON.parse(catalogData);
      let importedBackups = 0;
      let importedSchedules = 0;
      const errors: string[] = [];

      // Import backups
      if (catalog.backups && Array.isArray(catalog.backups)) {
        catalog.backups.forEach((backup: BackupMetadata) => {
          if (backup.backupId && !this.backups.has(backup.backupId)) {
            this.backups.set(backup.backupId, backup);
            importedBackups++;
          }
        });
      }

      // Import schedules
      if (catalog.schedules && Array.isArray(catalog.schedules)) {
        catalog.schedules.forEach((schedule: BackupSchedule) => {
          if (schedule.id && !this.schedules.has(schedule.id)) {
            this.schedules.set(schedule.id, schedule);
            importedSchedules++;
          }
        });
      }

      return { importedBackups, importedSchedules, errors };
    } catch (error) {
      return {
        importedBackups: 0,
        importedSchedules: 0,
        errors: [error instanceof Error ? error.message : 'Failed to parse catalog'],
      };
    }
  }
}

// Export default instance
export const whatsappBackupService = new WhatsAppBackupService();

// Utility functions
export function formatBackupSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function estimateBackupSize(recordCounts: Record<string, number>): number {
  const avgSizes = {
    guests: 300, // bytes per guest record
    campaigns: 500,
    templates: 200,
    analytics: 150,
    importHistory: 400,
    tokenGeneration: 100,
    configurations: 50,
  };

  return Object.entries(recordCounts).reduce((total, [type, count]) => {
    const avgSize = avgSizes[type as keyof typeof avgSizes] || 100;
    return total + (count * avgSize);
  }, 0);
}

export function validateBackupPassword(password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  issues: string[];
} {
  const issues: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  if (password.length < 12) {
    issues.push('Password must be at least 12 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    issues.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    issues.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    issues.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    issues.push('Password must contain at least one special character');
  }

  const score = 5 - issues.length;
  if (score >= 4) strength = 'strong';
  else if (score >= 2) strength = 'medium';

  return {
    isValid: issues.length === 0,
    strength,
    issues,
  };
}

export default WhatsAppBackupService;