import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as PDFDocument from 'pdfkit';
import { MassOffering, MassOfferingType, IntentionCategory } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

interface MassCardData {
    orderNumber: string;
    offeringType: MassOfferingType;
    intentionFor: string;
    additionalNames: string[];
    isForLiving: boolean;
    categories: IntentionCategory[];
    offeredBy?: string;
    inMemoryOf?: string;
    inHonorOf?: string;
    tributeMessage?: string;
    celebrationDate?: Date;
    celebrant?: string;
}

@Injectable()
export class PdfService {
    private readonly logger = new Logger(PdfService.name);
    private readonly uploadsDir: string;

    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
    ) {
        // Set up uploads directory
        this.uploadsDir = path.join(process.cwd(), 'uploads', 'mass-cards');
        if (!fs.existsSync(this.uploadsDir)) {
            fs.mkdirSync(this.uploadsDir, { recursive: true });
        }
    }

    /**
     * Generate a PDF Mass Card for an offering
     */
    async generateMassCard(offeringId: string): Promise<string | null> {
        try {
            const offering = await this.prisma.massOffering.findUnique({
                where: { id: offeringId },
            });

            if (!offering) {
                this.logger.error(`Offering not found: ${offeringId}`);
                return null;
            }

            const filename = `mass-card-${offering.orderNumber}.pdf`;
            const filepath = path.join(this.uploadsDir, filename);

            await this.createMassCardPdf({
                ...offering,
                offeredBy: offering.offeredBy || undefined,
            } as any, filepath);

            // Update offering with certificate URL
            const publicUrl = `/api/mass-offerings/cards/${filename}`;
            await this.prisma.massOffering.update({
                where: { id: offeringId },
                data: {
                    certificateUrl: publicUrl,
                    cardGeneratedAt: new Date(),
                },
            });

            this.logger.log(`Mass card generated: ${filename}`);
            return publicUrl;

        } catch (error: any) {
            this.logger.error(`Failed to generate Mass card: ${error.message}`);
            return null;
        }
    }

    /**
     * Create the actual PDF document
     */
    private async createMassCardPdf(data: MassCardData, filepath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({
                size: [432, 288], // 6x4 inches at 72 DPI (landscape card)
                margins: { top: 20, bottom: 20, left: 30, right: 30 },
            });

            const stream = fs.createWriteStream(filepath);
            doc.pipe(stream);

            // Background gradient effect (light cream/gold)
            doc.rect(0, 0, 432, 288).fill('#FFFBF0');

            // Decorative border
            doc.strokeColor('#D4AF37').lineWidth(2);
            doc.rect(8, 8, 416, 272).stroke();
            doc.strokeColor('#8B6914').lineWidth(0.5);
            doc.rect(12, 12, 408, 264).stroke();

            // Cross symbol at top
            doc.fontSize(28).fillColor('#8B6914');
            doc.text('✝', 0, 25, { align: 'center' });

            // Title
            doc.fontSize(16).fillColor('#4A3200');
            doc.text('HOLY SACRIFICE OF THE MASS', 0, 55, { align: 'center' });

            // Offering type
            const offeringTypeLabel = this.getOfferingTypeLabel(data.offeringType);
            doc.fontSize(11).fillColor('#6B4D00');
            doc.text(offeringTypeLabel, 0, 75, { align: 'center' });

            // Main intention text
            doc.moveDown(0.8);
            doc.fontSize(10).fillColor('#333');

            const intentionType = data.isForLiving ? 'For the Living' : 'For the Repose of the Soul of';
            doc.text(intentionType, { align: 'center' });

            // Name(s)
            doc.fontSize(14).fillColor('#1a1a1a');
            doc.moveDown(0.3);
            let names = data.intentionFor;
            if (data.additionalNames && data.additionalNames.length > 0) {
                names += ', ' + data.additionalNames.join(', ');
            }
            doc.text(names, { align: 'center' });

            // Categories (intentions)
            if (data.categories && data.categories.length > 0) {
                doc.moveDown(0.5);
                doc.fontSize(9).fillColor('#555');
                const categoryLabels = data.categories.map(c => this.getCategoryLabel(c)).join(' • ');
                doc.text(categoryLabels, { align: 'center' });
            }

            // Tribute message if any
            if (data.tributeMessage) {
                doc.moveDown(0.5);
                doc.fontSize(9).fillColor('#444').font('Helvetica-Oblique');
                doc.text(`"${data.tributeMessage}"`, { align: 'center' });
                doc.font('Helvetica');
            }

            // Offered by
            if (data.offeredBy) {
                doc.moveDown(0.5);
                doc.fontSize(9).fillColor('#666');
                doc.text(`Offered by ${data.offeredBy}`, { align: 'center' });
            }

            // Celebration date if known
            if (data.celebrationDate) {
                doc.moveDown(0.5);
                doc.fontSize(9).fillColor('#666');
                const dateStr = new Date(data.celebrationDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
                doc.text(`Mass will be celebrated on ${dateStr}`, { align: 'center' });
                if (data.celebrant) {
                    doc.text(`by ${data.celebrant}`, { align: 'center' });
                }
            }

            // Footer
            doc.fillColor('#888').fontSize(7);
            doc.text('MyPrayerTower • www.myprayertower.com', 0, 255, { align: 'center' });
            doc.text(`Order: ${data.orderNumber}`, 0, 265, { align: 'center' });

            doc.end();

            stream.on('finish', resolve);
            stream.on('error', reject);
        });
    }

    /**
     * Get display label for offering type
     */
    private getOfferingTypeLabel(type: MassOfferingType): string {
        const labels: Record<MassOfferingType, string> = {
            REGULAR: 'Single Mass Offering',
            EXPEDITED: 'Expedited Mass Offering',
            NOVENA: 'Novena of Masses (9 Masses)',
            GREGORIAN: 'Gregorian Masses (30 Masses)',
            PERPETUAL: 'Perpetual Enrollment',
            MONTHLY_CLUB: 'Monthly Mass Club',
        };
        return labels[type] || 'Mass Offering';
    }

    /**
     * Get display label for intention category
     */
    private getCategoryLabel(category: IntentionCategory): string {
        const labels: Record<IntentionCategory, string> = {
            THANKSGIVING: 'Thanksgiving',
            GOOD_HEALTH: 'Good Health',
            HEALING: 'Healing',
            BIRTHDAY_BLESSING: 'Birthday Blessing',
            WEDDING_ANNIVERSARY: 'Wedding Anniversary',
            SAFE_TRAVEL: 'Safe Travel',
            EXAM_SUCCESS: 'Exam Success',
            CAREER_SUCCESS: 'Career Success',
            FAMILY_PEACE: 'Family Peace',
            FAMILY_UNITY: 'Family Unity',
            PROTECTION: 'Protection',
            CONVERSION: 'Conversion',
            SPECIAL_GRACE: 'Special Grace',
            VOCATIONS: 'Vocations',
            REPOSE_OF_SOUL: 'Repose of the Soul',
            ALL_SOULS: 'All Souls',
            DEATH_ANNIVERSARY: 'Death Anniversary',
            RECENTLY_DECEASED: 'Recently Deceased',
            FORGOTTEN_SOULS: 'Forgotten Souls',
            PURGATORY: 'Souls in Purgatory',
            FEAST_DAY: 'Feast Day',
            ALL_SAINTS: 'All Saints',
            CHRISTMAS: 'Christmas',
            EASTER: 'Easter',
            MOTHERS_DAY: "Mother's Day",
            FATHERS_DAY: "Father's Day",
            SPECIAL_INTENTION: 'Special Intention',
            OTHER: 'Special Intention',
        };
        return labels[category] || 'Intention';
    }

    /**
     * Get file path for a mass card
     */
    getCardFilePath(filename: string): string {
        return path.join(this.uploadsDir, filename);
    }
}
