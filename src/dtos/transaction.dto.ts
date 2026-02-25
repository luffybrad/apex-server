// src/dtos/transaction.dto.ts
import {
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsString,
  IsObject,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class DepositMetadataDTO {
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}

export class DepositDTO {
  @IsNumber()
  @Min(100)
  @Max(1000000)
  amount!: number;

  @IsOptional()
  @IsString()
  paymentMethod?: string; // M-PESA, Card, etc.

  @IsOptional()
  @IsString()
  transactionReference?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DepositMetadataDTO)
  metadata?: DepositMetadataDTO;
}

export class WithdrawalDTO {
  @IsNumber()
  @Min(100)
  @Max(1000000)
  amount!: number;

  @IsString()
  withdrawalMethod!: string; // M-PESA, Bank, etc.

  @IsString()
  accountDetails!: string; // Phone number, bank account
}
