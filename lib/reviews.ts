import { z } from 'zod';

export const ReviewSchema = z.object({
  id: z.string(),
  rating: z.number().min(1).max(5),
  content: z.string().min(10),
  author: z.string(),
  date: z.date(),
});

export type Review = z.infer<typeof ReviewSchema>;

const generateReviews = (count: number): Review[] => {
  const names = [
    "Lina A.", "Mohammed F.", "Sara B.", "Hassan K.", "Emily R.",
    "John D.", "Olivia P.", "James L.", "Amira T.", "Sami M."
  ];
  
  const reviews = [];
  for (let i = 0; i < count; i++) {
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomRating = Math.floor(Math.random() * 5) + 1;
    const randomContent = `This is review number ${i + 1}, great product!`;
    const randomDate = new Date(Date.now() - Math.floor(Math.random() * 10000000000));
    
    reviews.push({
      id: String(i + 1),
      rating: randomRating,
      content: randomContent,
      author: randomName,
      date: randomDate,
    });
  }
  return reviews;
};

export const mockReviews = generateReviews(150000);

