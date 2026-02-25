// src/services/mpesa.service.ts
export class MpesaService {
  private consumerKey: string;
  private consumerSecret: string;
  private passkey: string;
  private shortCode: string;

  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY!;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
    this.passkey = process.env.MPESA_PASSKEY!;
    this.shortCode = process.env.MPESA_SHORTCODE!;
  }

  // Get OAuth token
  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(
      `${this.consumerKey}:${this.consumerSecret}`,
    ).toString("base64");
    const response = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      },
    );
    const data = (await response.json()) as { access_token: string };
    return data.access_token;
  }

  // Initiate STK Push
  async stkPush(
    phoneNumber: string,
    amount: number,
    accountReference: string,
  ): Promise<any> {
    const token = await this.getAccessToken();
    const timestamp = this.getTimestamp();
    const password = Buffer.from(
      `${this.shortCode}${this.passkey}${timestamp}`,
    ).toString("base64");

    const response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: this.shortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: phoneNumber,
          PartyB: this.shortCode,
          PhoneNumber: phoneNumber,
          CallBackURL: `${process.env.API_URL}/api/mpesa/callback`,
          AccountReference: accountReference,
          TransactionDesc: "Apex Investment Deposit",
        }),
      },
    );

    return await response.json();
  }

  private getTimestamp(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");
    return `${year}${month}${day}${hour}${minute}${second}`;
  }
}
