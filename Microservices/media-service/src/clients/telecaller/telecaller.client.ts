import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Telecaller } from './interfaces/telecaller.interface';

@Injectable()
export class TelecallerClient {
  private readonly logger = new Logger(TelecallerClient.name);
  private client: ClientProxy;

  constructor(
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('TELECALLER_SERVICE_HOST', 'localhost');
    const port = Number(this.configService.get<string>('TELECALLER_SERVICE_TCP_PORT', '8006'));

    this.logger.log(`Telecaller Client initialized with TCP: ${host}:${port}`);

    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host,
        port,
      },
    });
  }

  /**
   * Get telecaller by ID
   */
  async getTelecallerById(telecallerId: string): Promise<Telecaller> {
    try {
      const telecaller = await firstValueFrom(
        this.client.send<Telecaller>({ cmd: 'get_telecaller_by_id' }, telecallerId),
      );
      return telecaller;
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch telecaller ${telecallerId}`,
        error.message,
      );
      throw new HttpException(
        `Failed to fetch telecaller: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get telecaller by user ID
   */
  async getTelecallerByUserId(userId: string): Promise<Telecaller> {
    try {
      const telecaller = await firstValueFrom(
        this.client.send<Telecaller>({ cmd: 'get_telecaller_by_user_id' }, userId),
      );
      return telecaller;
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch telecaller by userId ${userId}`,
        error.message,
      );
      throw new HttpException(
        `Failed to fetch telecaller by userId: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all telecallers
   */
  async getAllTelecallers(): Promise<Telecaller[]> {
    try {
      const telecallers = await firstValueFrom(
        this.client.send<Telecaller[]>({ cmd: 'get_all_telecallers' }, {}),
      );
      return telecallers;
    } catch (error: any) {
      this.logger.error('Failed to fetch all telecallers', error.message);
      throw new HttpException(
        `Failed to fetch all telecallers: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get telecallers by organization
   */
  async getTelecallersByOrganization(organizationId: string): Promise<Telecaller[]> {
    try {
      const telecallers = await firstValueFrom(
        this.client.send<Telecaller[]>(
          { cmd: 'get_telecallers_by_organization' },
          organizationId,
        ),
      );
      return telecallers;
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch telecallers for organization ${organizationId}`,
        error.message,
      );
      throw new HttpException(
        `Failed to fetch organization telecallers: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
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
      const result = await firstValueFrom(
        this.client.send<{ status: string }>({ cmd: 'health_check' }, {}),
      );
      return result.status === 'ok';
    } catch (error: any) {
      this.logger.error('Telecaller service health check failed', error.message);
      return false;
    }
  }
}
