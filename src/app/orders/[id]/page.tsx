
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import AuthGuard from '@/components/guards/AuthGuard'; 
import type { MockOrderDetails } from '@/types';
import OrderDetailsContent from '@/components/orders/OrderDetailsContent';

interface OrderDetailsPageParams {
  params: { id: string };
}

// In a real app, this would fetch from a database or API
async function getOrderDetails(orderId: string): Promise<MockOrderDetails | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500)); 
  
  if (orderId.startsWith('mock')) {
     const baseOrder = {
        id: orderId,
        date: '2024-05-18',
        total: orderId === 'mock123' ? 35.99 : 22.50,
        items: [
            { id: 'd1', name: orderId === 'mock123' ? 'Margherita Pizza' : 'Sushi Platter', quantity: 1, price: orderId === 'mock123' ? 20.99 : 17.50, description: '', imageUrl: '', restaurantId: '', category: '' },
            { id: 'd2', name: orderId === 'mock123' ? 'Coke' : 'Miso Soup', quantity: 2, price: 2.50, description: '', imageUrl: '', restaurantId: '', category: '' },
        ],
        deliveryAddress: '123 Foodie Lane, Flavor Town, FT 54321',
        contactNumber: '(555) 987-6543',
     }
     if (orderId === 'mock123') {
        return { ...baseOrder, status: 'Delivered', estimatedDeliveryTime: 'Delivered on May 18, 2024, 7:30 PM' }
     }
     return { ...baseOrder, status: 'Preparing', estimatedDeliveryTime: 'May 18, 2024, 8:00 PM - 8:30 PM' }
  }
  
  // This case handles newly created orders from the checkout page.
  if (!orderId.startsWith('mock') && orderId.length === 9) { 
    return {
      id: orderId,
      date: new Date().toISOString(),
      total: Math.random() * 50 + 20, 
      status: 'Preparing',
      items: [
        { id: 'd3', name: 'Personalized Meal Recommendation', quantity: 1, price: 25.00, description: '', imageUrl: '', restaurantId: '', category: '' },
        { id: 'd4', name: 'Delivery Fee', quantity: 1, price: 5.00, description: '', imageUrl: '', restaurantId: '', category: '' },
      ],
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deliveryAddress: '123 Main St, Anytown, USA', 
      contactNumber: '(555) 123-4567',
    };
  }

  return null; 
}

// Generate metadata for the page
export async function generateMetadata({ params }: OrderDetailsPageParams): Promise<Metadata> {
  return {
    title: `Order Details #${params.id} - QuickPlate`,
    description: `View details and track your QuickPlate order ${params.id}.`,
  };
}


// This is now a true Server Component
export default async function OrderDetailsPage( { params }: OrderDetailsPageParams) {
  const orderId = params.id;
  const orderDetails = await getOrderDetails(orderId);

  if (!orderDetails) {
    notFound();
  }

  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
        <OrderDetailsContent orderDetails={orderDetails} />
      </Suspense>
    </AuthGuard>
  );
}
