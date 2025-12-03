import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

interface PaymentForm {
  name: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

const Payment: React.FC = () => {
  const [form, setForm] = useState<PaymentForm>({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Payment submitted:', form);
    alert('Payment submitted successfully!');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Name on Card</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={form.cardNumber}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1 font-medium">Expiry</label>
                <input
                  type="text"
                  name="expiry"
                  value={form.expiry}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>

              <div className="flex-1">
                <label className="block mb-1 font-medium">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={form.cvv}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-4">
              Pay Now
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;
