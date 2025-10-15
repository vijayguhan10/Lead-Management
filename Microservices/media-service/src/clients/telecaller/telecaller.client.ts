import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Telecaller } from './interfaces/telecaller.interface';

@Injectable()
export class TelecallerClient {
  private readonly logger = new Logger(TelecallerClient.name);
  private readonly telecallerServiceUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.telecallerServiceUrl = this.configService.get<string>(
      'TELECALLER_SERVICE_URL',
      'http://localhost:3006',
    );

    this.logger.log(
      `Telecaller Client initialized with URL: ${this.telecallerServiceUrl}`,
    );
  }

  /**
   * Get telecaller by ID
   */
  async getTelecallerById(telecallerId: string): Promise<Telecaller> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<Telecaller>(`${this.telecallerServiceUrl}/telecallers/${telecallerId}`),
      );
      return response.data;
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch telecaller ${telecallerId}`,
        error.message,
      );
      throw new HttpException(
        `Failed to fetch telecaller: ${error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get telecaller by user ID
   */
  async getTelecallerByUserId(userId: string): Promise<Telecaller> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<Telecaller>(`${this.telecallerServiceUrl}/telecallers/byUser/${userId}`),
      );
      return response.data;
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch telecaller by userId ${userId}`,
        error.message,
      );
      throw new HttpException(
        `Failed to fetch telecaller by userId: ${error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all telecallers
   */
  async getAllTelecallers(): Promise<Telecaller[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<Telecaller[]>(`${this.telecallerServiceUrl}/telecallers`),
      );
      return response.data;
    } catch (error: any) {
      this.logger.error('Failed to fetch all telecallers', error.message);
      throw new HttpException(
        `Failed to fetch all telecallers: ${error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get telecallers by organization
   */
  async getTelecallersByOrganization(organizationId: string): Promise<Telecaller[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<Telecaller[]>(
          `${this.telecallerServiceUrl}/telecallers/organization/${organizationId}`,
        ),
      );
      return response.data;
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch telecallers for organization ${organizationId}`,
        error.message,
      );
      throw new HttpException(
        `Failed to fetch organization telecallers: ${error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get telecallers by their IDs (batch request)
   */
  async getTelecallersByIds(telecallerIds: string[]): Promise<Map<string, Telecaller>> {
    const telecallerMap = new Map<string, Telecaller>();

    // Fetch telecallers in parallel
    const promises = telecallerIds.map(async (id) => {
      try {
        const telecaller = await this.getTelecallerById(id);
        telecallerMap.set(id, telecaller);
      } catch (error: any) {
        this.logger.warn(`Failed to fetch telecaller ${id}, skipping: ${error.message}`);
        // Continuing execution - this is expected behavior for missing telecallers
      }
    });

    await Promise.all(promises);

    this.logger.log(
      `Fetched ${telecallerMap.size} telecallers out of ${telecallerIds.length} requested`,
    );

    return telecallerMap;
  }

  /**
   * Health check for telecaller service
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<{ status: string }>(`${this.telecallerServiceUrl}/health`),
      );
      return response.status === 200;
    } catch (error: any) {
      this.logger.error('Telecaller service health check failed', error.message);
      return false;
    }
  }
}
