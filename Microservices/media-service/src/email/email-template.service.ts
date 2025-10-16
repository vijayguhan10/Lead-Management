import { Injectable } from '@nestjs/common';
import { SendFollowUpEmailDto } from './dto/send-follow-up-email.dto';

@Injectable()
export class EmailTemplateService {
  /**
   * Generate HTML template for follow-up reminder email
   */
  generateFollowUpReminderTemplate(dto: SendFollowUpEmailDto): string {
    const followUpDate = new Date(dto.nextFollowUp);
    const timeframe = dto.notificationType === 'ONE_HOUR' ? '1 hour' : '30 minutes';
    const urgencyColor = dto.notificationType === 'THIRTY_MINUTES' ? '#dc2626' : '#f59e0b';
    const priorityBadgeColor = this.getPriorityColor(dto.leadPriority);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Follow-up Reminder</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                ⏰ Follow-up Reminder
              </h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">
                Lead Management System
              </p>
            </td>
          </tr>

          <!-- Alert Banner -->
          <tr>
            <td style="background-color: ${urgencyColor}; padding: 15px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">
                ⚠️ Follow-up scheduled in ${timeframe}
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 30px 20px 30px;">
              <p style="margin: 0; font-size: 16px; color: #111827; line-height: 1.5;">
                Hello <strong>${this.escapeHtml(dto.telecallerName)}</strong>,
              </p>
              <p style="margin: 15px 0 0 0; font-size: 16px; color: #374151; line-height: 1.6;">
                This is a reminder that you have an upcoming follow-up scheduled in <strong style="color: ${urgencyColor};">${timeframe}</strong>.
              </p>
            </td>
          </tr>

          <!-- Lead Information Card -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <table role="presentation" style="width: 100%; border: 2px solid #e5e7eb; border-radius: 8px; background-color: #f9fafb;">
                
                <!-- Card Header -->
                <tr>
                  <td style="padding: 20px; border-bottom: 1px solid #e5e7eb; background-color: #eff6ff;">
                    <h2 style="margin: 0; font-size: 18px; color: #1e40af; display: flex; align-items: center;">
                      👤 Lead Details
                    </h2>
                  </td>
                </tr>

                <!-- Lead Basic Info -->
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="font-weight: 600; color: #374151; font-size: 14px;">Name:</span>
                          <span style="color: #111827; font-size: 16px; margin-left: 10px; font-weight: 500;">
                            ${this.escapeHtml(dto.leadName)}
                          </span>
                          ${dto.leadPriority ? `
                          <span style="display: inline-block; margin-left: 10px; padding: 3px 10px; background-color: ${priorityBadgeColor}; color: #ffffff; border-radius: 12px; font-size: 12px; font-weight: 600;">
                            ${this.escapeHtml(dto.leadPriority)} Priority
                          </span>
                          ` : ''}
                        </td>
                      </tr>

                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="font-weight: 600; color: #374151; font-size: 14px;">📞 Phone:</span>
                          <a href="tel:${dto.leadPhone}" style="color: #2563eb; text-decoration: none; margin-left: 10px; font-size: 16px; font-weight: 500;">
                            ${this.escapeHtml(dto.leadPhone)}
                          </a>
                        </td>
                      </tr>

                      ${dto.leadEmail ? `
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="font-weight: 600; color: #374151; font-size: 14px;">📧 Email:</span>
                          <a href="mailto:${dto.leadEmail}" style="color: #2563eb; text-decoration: none; margin-left: 10px; font-size: 16px;">
                            ${this.escapeHtml(dto.leadEmail)}
                          </a>
                        </td>
                      </tr>
                      ` : ''}

                      ${dto.leadCompany ? `
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="font-weight: 600; color: #374151; font-size: 14px;">🏢 Company:</span>
                          <span style="color: #111827; margin-left: 10px; font-size: 16px;">
                            ${this.escapeHtml(dto.leadCompany)}
                          </span>
                        </td>
                      </tr>
                      ` : ''}

                      ${dto.leadPosition ? `
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="font-weight: 600; color: #374151; font-size: 14px;">💼 Position:</span>
                          <span style="color: #111827; margin-left: 10px; font-size: 16px;">
                            ${this.escapeHtml(dto.leadPosition)}
                          </span>
                        </td>
                      </tr>
                      ` : ''}

                      ${dto.leadSource ? `
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="font-weight: 600; color: #374151; font-size: 14px;">📍 Source:</span>
                          <span style="color: #111827; margin-left: 10px; font-size: 16px;">
                            ${this.escapeHtml(dto.leadSource)}
                          </span>
                        </td>
                      </tr>
                      ` : ''}

                      ${dto.leadStatus ? `
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="font-weight: 600; color: #374151; font-size: 14px;">📊 Status:</span>
                          <span style="color: #111827; margin-left: 10px; font-size: 16px;">
                            ${this.escapeHtml(dto.leadStatus)}
                          </span>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>

                <!-- Follow-up Time -->
                <tr>
                  <td style="padding: 20px; border-top: 1px solid #e5e7eb; background-color: #fef3c7;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="text-align: center;">
                          <p style="margin: 0; font-size: 14px; color: #92400e; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                            Scheduled Follow-up Time
                          </p>
                          <p style="margin: 10px 0 0 0; font-size: 20px; color: #78350f; font-weight: 700;">
                            📅 ${this.formatDateTime(followUpDate)}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                ${dto.interestedIn && dto.interestedIn.length > 0 ? `
                <!-- Interested In -->
                <tr>
                  <td style="padding: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 10px 0; font-weight: 600; color: #374151; font-size: 14px;">
                      💡 Interested In:
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                      ${dto.interestedIn.map(item => `
                        <span style="display: inline-block; padding: 4px 12px; background-color: #dbeafe; color: #1e40af; border-radius: 12px; font-size: 13px; font-weight: 500;">
                          ${this.escapeHtml(item)}
                        </span>
                      `).join('')}
                    </div>
                  </td>
                </tr>
                ` : ''}

                ${dto.tags && dto.tags.length > 0 ? `
                <!-- Tags -->
                <tr>
                  <td style="padding: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 10px 0; font-weight: 600; color: #374151; font-size: 14px;">
                      🏷️ Tags:
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                      ${dto.tags.map(tag => `
                        <span style="display: inline-block; padding: 4px 12px; background-color: #e0e7ff; color: #4338ca; border-radius: 12px; font-size: 13px; font-weight: 500;">
                          ${this.escapeHtml(tag)}
                        </span>
                      `).join('')}
                    </div>
                  </td>
                </tr>
                ` : ''}

                ${dto.notes ? `
                <!-- Notes -->
                <tr>
                  <td style="padding: 20px; border-top: 1px solid #e5e7eb; background-color: #fffbeb;">
                    <p style="margin: 0 0 10px 0; font-weight: 600; color: #374151; font-size: 14px;">
                      📝 Notes:
                    </p>
                    <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
                      ${this.escapeHtml(dto.notes)}
                    </p>
                  </td>
                </tr>
                ` : ''}

              </table>
            </td>
          </tr>

          <!-- Action Items: show only when there are no lead notes -->
          ${!dto.notes ? `
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; border-radius: 6px;">
                <p style="margin: 0 0 10px 0; font-weight: 700; color: #065f46; font-size: 16px;">
                  ✅ Recommended Actions:
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #047857; font-size: 14px; line-height: 1.8;">
                  <li>Review the lead details and previous interaction history</li>
                  <li>Prepare discussion points based on their interests</li>
                  <li>Have relevant materials and information ready</li>
                  <li>Ensure you're in a quiet environment for the call</li>
                  <li>Update the lead status and notes after the follow-up</li>
                </ul>
              </div>
            </td>
          </tr>
          ` : ''}

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; border-top: 1px solid #e5e7eb; background-color: #f9fafb; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.6;">
                This is an automated reminder from the Lead Management System.<br>
                Please do not reply to this email.
              </p>
              <p style="margin: 15px 0 0 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} Lead Management System. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  /**
   * Generate plain text version for follow-up reminder
   */
  generateFollowUpReminderText(dto: SendFollowUpEmailDto): string {
    const followUpDate = new Date(dto.nextFollowUp);
    const timeframe = dto.notificationType === 'ONE_HOUR' ? '1 hour' : '30 minutes';

    let text = `FOLLOW-UP REMINDER\n\n`;
    text += `Hello ${dto.telecallerName},\n\n`;
    text += `This is a reminder that you have an upcoming follow-up scheduled in ${timeframe}.\n\n`;
    
    text += `LEAD DETAILS:\n`;
    text += `Name: ${dto.leadName}\n`;
    text += `Phone: ${dto.leadPhone}\n`;
    
    if (dto.leadEmail) text += `Email: ${dto.leadEmail}\n`;
    if (dto.leadCompany) text += `Company: ${dto.leadCompany}\n`;
    if (dto.leadPosition) text += `Position: ${dto.leadPosition}\n`;
    if (dto.leadSource) text += `Source: ${dto.leadSource}\n`;
    if (dto.leadStatus) text += `Status: ${dto.leadStatus}\n`;
    if (dto.leadPriority) text += `Priority: ${dto.leadPriority}\n`;
    
    text += `\nScheduled Follow-up Time: ${this.formatDateTime(followUpDate)}\n`;
    
    if (dto.interestedIn && dto.interestedIn.length > 0) {
      text += `\nInterested In: ${dto.interestedIn.join(', ')}\n`;
    }
    
    if (dto.tags && dto.tags.length > 0) {
      text += `Tags: ${dto.tags.join(', ')}\n`;
    }
    
    if (dto.notes) {
      text += `\nNOTES:\n${dto.notes}\n`;
    } else {
      text += `\nRECOMMENDED ACTIONS:\n`;
      text += `- Review the lead details and previous interaction history\n`;
      text += `- Prepare discussion points based on their interests\n`;
      text += `- Have relevant materials and information ready\n`;
      text += `- Ensure you're in a quiet environment for the call\n`;
      text += `- Update the lead status and notes after the follow-up\n`;
    }
    
    text += `\n---\n`;
    text += `This is an automated reminder from the Lead Management System.\n`;
    text += `Please do not reply to this email.\n`;
    
    return text;
  }

  /**
   * Helper: Escape HTML to prevent XSS
   */
  private escapeHtml(text: string): string {
    if (!text) return '';
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * Helper: Format date and time for display
   */
  private formatDateTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  }

  /**
   * Helper: Get priority badge color
   */
  private getPriorityColor(priority?: string): string {
    if (!priority) return '#6b7280';
    
    const priorityLower = priority.toLowerCase();
    if (priorityLower === 'high') return '#dc2626';
    if (priorityLower === 'medium') return '#f59e0b';
    if (priorityLower === 'low') return '#10b981';
    
    return '#6b7280';
  }
}
