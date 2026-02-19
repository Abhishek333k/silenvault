// assets/templates/invoices/theme_bundle.js

window.InvoiceThemes = {
    // 1. STANDARD CORPORATE
    standard: (data) => `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; padding: 40px; background: white; min-height: 100%; box-sizing: border-box;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
                <div>
                    <h1 style="font-size: 32px; font-weight: bold; margin: 0; color: #111; text-transform: uppercase; letter-spacing: 2px;">INVOICE</h1>
                    <p style="margin: 5px 0 0 0; color: #666;"># ${data.invoiceNo}</p>
                </div>
                <div style="text-align: right;">
                    ${data.logo ? `<img src="${data.logo}" style="max-height: 60px; max-width: 200px; margin-bottom: 10px; display: block; margin-left: auto;">` : `<h2 style="margin: 0; font-size: 20px; color: #111;">${data.fromName || 'Your Company'}</h2>`}
                    ${data.logo && data.fromName ? `<h3 style="margin: 0 0 5px 0; font-size: 14px; color: #333;">${data.fromName}</h3>` : ''}
                    <p style="margin: 5px 0 0 0; color: #666; font-size: 14px; white-space: pre-line;">${data.fromAddress || 'Address details...'}</p>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
                <div>
                    <p style="margin: 0 0 5px 0; color: #888; font-size: 12px; text-transform: uppercase;">Bill To</p>
                    <h3 style="margin: 0 0 5px 0; font-size: 16px;">${data.toName || 'Client Name'}</h3>
                    <p style="margin: 0; color: #666; font-size: 14px; white-space: pre-line;">${data.toAddress || 'Client Address...'}</p>
                </div>
                <div style="text-align: right;">
                    <p style="margin: 0 0 5px 0;"><strong>Date:</strong> ${data.date}</p>
                    <p style="margin: 0;"><strong>Due Date:</strong> ${data.dueDate}</p>
                </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                    <tr style="background: #f8f8f8; border-top: 1px solid #ddd; border-bottom: 1px solid #ddd;">
                        <th style="padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #666;">Description</th>
                        <th style="padding: 12px; text-align: right; font-size: 12px; text-transform: uppercase; color: #666;">Qty</th>
                        <th style="padding: 12px; text-align: right; font-size: 12px; text-transform: uppercase; color: #666;">Price</th>
                        <th style="padding: 12px; text-align: right; font-size: 12px; text-transform: uppercase; color: #666;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.items.map(item => `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 12px; text-align: left; font-size: 14px;">${item.desc || 'Item Name'}</td>
                        <td style="padding: 12px; text-align: right; font-size: 14px;">${item.qty}</td>
                        <td style="padding: 12px; text-align: right; font-size: 14px;">${data.currencySym}${Number(item.rate).toFixed(2)}</td>
                        <td style="padding: 12px; text-align: right; font-size: 14px;">${data.currencySym}${(item.qty * item.rate).toFixed(2)}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>

            <div style="display: flex; justify-content: flex-end;">
                <div style="width: 50%;">
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                        <span style="color: #666;">Subtotal</span>
                        <span>${data.currencySym}${data.subtotal.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                        <span style="color: #666;">Tax (${data.tax}%)</span>
                        <span>${data.currencySym}${data.taxAmount.toFixed(2)}</span>
                    </div>
                    ${data.discount > 0 ? `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; color: #d97706;">
                        <span>Discount</span>
                        <span>-${data.currencySym}${data.discount.toFixed(2)}</span>
                    </div>
                    ` : ''}
                    <div style="display: flex; justify-content: space-between; padding: 16px 0; border-top: 2px solid #333;">
                        <span style="font-weight: bold; font-size: 18px;">Total</span>
                        <span style="font-weight: bold; font-size: 18px;">${data.currencySym}${data.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div style="margin-top: 60px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888;">
                <strong>Notes:</strong><br>
                <span style="white-space: pre-line;">${data.notes || 'Thank you for your business.'}</span>
            </div>
        </div>
    `,

    // 2. MODERN ACCENT
    modern: (data) => `
        <div style="font-family: 'Inter', sans-serif; color: #1e293b; padding: 40px; background: white; min-height: 100%; box-sizing: border-box;">
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
                <div>
                    ${data.logo ? `<img src="${data.logo}" style="max-height: 60px; max-width: 200px; margin-bottom: 15px; display: block;">` : ''}
                    <h2 style="margin: 0; font-size: 24px; color: #0f172a; font-weight: 800;">${data.fromName || 'Your Company'}</h2>
                    <p style="margin: 5px 0 0 0; color: #64748b; font-size: 13px; white-space: pre-line;">${data.fromAddress || 'Address details...'}</p>
                </div>
                <div style="text-align: right;">
                    <h1 style="font-size: 40px; font-weight: 900; margin: 0; color: #2563eb; letter-spacing: -1px;">INVOICE</h1>
                    <div style="background: #f1f5f9; padding: 8px 16px; border-radius: 8px; display: inline-block; margin-top: 10px;">
                        <p style="margin: 0; font-weight: 700; color: #334155;"># ${data.invoiceNo}</p>
                    </div>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 40px; background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #2563eb;">
                <div>
                    <p style="margin: 0 0 5px 0; color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Billed To</p>
                    <h3 style="margin: 0 0 5px 0; font-size: 16px; color: #0f172a;">${data.toName || 'Client Name'}</h3>
                    <p style="margin: 0; color: #475569; font-size: 13px; white-space: pre-line;">${data.toAddress || 'Client Address...'}</p>
                </div>
                <div style="text-align: right; display: flex; flex-direction: column; gap: 10px;">
                    <div>
                        <p style="margin: 0; color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: bold;">Issue Date</p>
                        <p style="margin: 0; font-weight: 600; color: #1e293b;">${data.date}</p>
                    </div>
                    <div>
                        <p style="margin: 0; color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: bold;">Due Date</p>
                        <p style="margin: 0; font-weight: 600; color: #1e293b;">${data.dueDate}</p>
                    </div>
                </div>
            </div>

            <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 30px;">
                <thead>
                    <tr>
                        <th style="padding: 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; border-bottom: 2px solid #e2e8f0;">Description</th>
                        <th style="padding: 12px; text-align: right; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; border-bottom: 2px solid #e2e8f0;">Qty</th>
                        <th style="padding: 12px; text-align: right; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; border-bottom: 2px solid #e2e8f0;">Rate</th>
                        <th style="padding: 12px; text-align: right; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; border-bottom: 2px solid #e2e8f0;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.items.map(item => `
                    <tr>
                        <td style="padding: 16px 12px; text-align: left; font-size: 14px; font-weight: 500; border-bottom: 1px solid #f1f5f9;">${item.desc || 'Item Name'}</td>
                        <td style="padding: 16px 12px; text-align: right; font-size: 14px; color: #475569; border-bottom: 1px solid #f1f5f9;">${item.qty}</td>
                        <td style="padding: 16px 12px; text-align: right; font-size: 14px; color: #475569; border-bottom: 1px solid #f1f5f9;">${data.currencySym}${Number(item.rate).toFixed(2)}</td>
                        <td style="padding: 16px 12px; text-align: right; font-size: 14px; font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${data.currencySym}${(item.qty * item.rate).toFixed(2)}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>

            <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
                <div style="width: 300px; background: #f8fafc; border-radius: 12px; padding: 20px;">
                    <div style="display: flex; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;">
                        <span style="color: #64748b; font-size: 14px;">Subtotal</span>
                        <span style="font-weight: 600;">${data.currencySym}${data.subtotal.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                        <span style="color: #64748b; font-size: 14px;">Tax (${data.tax}%)</span>
                        <span style="font-weight: 600;">${data.currencySym}${data.taxAmount.toFixed(2)}</span>
                    </div>
                    ${data.discount > 0 ? `
                    <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                        <span style="color: #64748b; font-size: 14px;">Discount</span>
                        <span style="font-weight: 600; color: #059669;">-${data.currencySym}${data.discount.toFixed(2)}</span>
                    </div>
                    ` : ''}
                    <div style="display: flex; justify-content: space-between; padding-top: 16px; margin-top: 8px;">
                        <span style="font-weight: 800; font-size: 20px; color: #0f172a;">Total Due</span>
                        <span style="font-weight: 900; font-size: 24px; color: #2563eb;">${data.currencySym}${data.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div style="margin-top: 20px; padding: 20px; background: #f1f5f9; border-radius: 12px; font-size: 13px; color: #475569;">
                <strong style="color: #0f172a; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Terms & Notes</strong><br>
                <span style="white-space: pre-line; display: block; margin-top: 5px;">${data.notes || 'Thank you for your business. Please process payment within 14 days.'}</span>
            </div>
        </div>
    `
};
