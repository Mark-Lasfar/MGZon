import { z } from 'zod';

export const ReviewSchema = z.object({
  id: z.string(),
  rating: z.number().min(1).max(5),
  content: z.string().min(10),
  author: z.string(),
  date: z.date(),
});

export type Review = z.infer<typeof ReviewSchema>;

const firstNames = ["John", "Emily", "Michael", "Sarah", "David", "Jessica", "Daniel", "Ashley", "Matthew", "Amanda"];
const lastNames = ["Smith", "Johnson", "Brown", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin"];
const reviewPhrases = [
  "Absolutely love this product!",
  "Exceeded my expectations!",
  "Not bad, but could be improved.",
  "Worst experience ever.",
  "Fast shipping and great quality!",
  "Will definitely buy again.",
  "Customer service was very helpful.",
  "Highly recommend to anyone.",
  "The packaging was very secure.",
  "Five stars all the way!",
];

const randomDate = (): Date => {
  const now = new Date();
  const past = new Date(now.getFullYear() - 1, 0, 1).getTime();
  const diff = now.getTime() - past;
  return new Date(past + Math.random() * diff);
};

const randomName = (): string => {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
};

const generateReview = (id: number): Review => ({
  id: id.toString(),
  rating: Math.floor(Math.random() * 5) + 1,
  content: reviewPhrases[Math.floor(Math.random() * reviewPhrases.length)],
  author: randomName(),
  date: randomDate(),
});

const TOTAL_REVIEWS = 150000;
export const mockReviews: Review[] = Array.from({ length: TOTAL_REVIEWS }, (_, i) => generateReview(i + 1));

export function getReviews(page: number = 1, limit: number = 50): { reviews: Review[]; total: number; page: number; totalPages: number; } {
  const start = (page - 1) * limit;
  const end = start + limit;
  const reviews = mockReviews.slice(start, end);
  return { reviews, total: TOTAL_REVIEWS, page, totalPages: Math.ceil(TOTAL_REVIEWS / limit) };
}
