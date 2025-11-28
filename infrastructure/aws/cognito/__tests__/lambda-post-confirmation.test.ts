import { handler } from '../lambda-post-confirmation';
import { PrismaClient } from '@prisma/client';
import mockEvent from './mock-cognito-event.json';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

const prismaMock = new PrismaClient() as jest.Mocked<PrismaClient>;

// Helper to reset mocks each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('lambda-post-confirmation.handler', () => {
  it('creates a new user if not present (unit test, Prisma mocked)', async () => {
    // 1. Not existing by cognitoUserId or email
    prismaMock.user.findUnique
      .mockResolvedValueOnce(null) // by cognitoUserId
      .mockResolvedValueOnce(null); // by email
    prismaMock.user.create.mockResolvedValueOnce({
      id: 'mockid',
      ...mockEvent.request.userAttributes,
      name: 'Mock User',
      emailVerified: new Date(),
      image: null,
      cognitoUserId: mockEvent.request.userAttributes.sub,
    } as any);

    (PrismaClient as any).mockImplementation(() => prismaMock);

    const returned = await handler(mockEvent as any);
    expect(prismaMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          cognitoUserId: 'mock-cognito-id-001',
          email: 'mocked.user@example.com',
          name: 'Mock User',
          emailVerified: expect.any(Date),
        })
      })
    );
    expect(returned).toEqual(expect.objectContaining({ version: '1' }));
  });
  
  it('is idempotent if user already exists', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      cognitoUserId: 'mock-cognito-id-001',
    } as any); // by cognitoUserId
    (PrismaClient as any).mockImplementation(() => prismaMock);
    
    const returned = await handler(mockEvent as any);
    expect(prismaMock.user.create).not.toHaveBeenCalled();
    expect(returned).toBe(mockEvent);
  });

  it('updates user if email match, but ID differs', async () => {
    // Not found by ID, found by email
    prismaMock.user.findUnique
      .mockResolvedValueOnce(null) // by cognitoUserId
      .mockResolvedValueOnce({
        email: 'mocked.user@example.com',
        cognitoUserId: 'other-id-002',
        emailVerified: null,
      } as any); // by email
    prismaMock.user.update.mockResolvedValueOnce({} as any);
    
    (PrismaClient as any).mockImplementation(() => prismaMock);
    const returned = await handler(mockEvent as any);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { email: 'mocked.user@example.com' },
      data: expect.objectContaining({ cognitoUserId: 'mock-cognito-id-001' }),
    });
    expect(returned).toBe(mockEvent);
  });
});

// --- Integration test scaffold (can be enabled with a real/ephemeral DB/config) ---
/*
describe('lambda-post-confirmation.handler (INTEGRATION, uses sqlite memory db)', () => {
  let prisma: PrismaClient;
  beforeAll(async () => {
    process.env.DATABASE_URL = 'file:memory:?cache=shared';
    prisma = new PrismaClient();
    await prisma.$connect();
    // You may want to migrate your schema here
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('creates user end-to-end (integration)', async () => {
    // Arrange
    await prisma.user.deleteMany({});
    const event = { ...mockEvent, request: { userAttributes: { ...mockEvent.request.userAttributes, sub: 'int-123', email: 'int@test.com' } } };
    // Act
    const result = await handler(event as any);
    // Assert
    const user = await prisma.user.findUnique({ where: { cognitoUserId: 'int-123' } });
    expect(user).toBeTruthy();
    expect(user?.email).toBe('int@test.com');
    expect(result).toBe(event);
  });
});
*/
