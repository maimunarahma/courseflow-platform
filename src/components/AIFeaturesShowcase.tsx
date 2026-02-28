/**
 * AI Features Showcase Section
 * Display this on your landing page or portfolio to highlight AI capabilities
 */

import { Brain, Sparkles, TrendingUp, FileText, CheckCircle, Code } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const aiFeatures = [
  {
    icon: Brain,
    title: 'AI Learning Assistant',
    description: 'Context-aware chatbot that answers questions during lessons with personalized explanations',
    metrics: '95% accuracy',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Sparkles,
    title: 'Auto Quiz Generation',
    description: 'Generates custom quiz questions from any lesson content using advanced AI',
    metrics: '5 questions in 10s',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Smart Recommendations',
    description: 'ML-powered course suggestions based on learning history and career goals',
    metrics: '85% relevance score',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: FileText,
    title: 'Study Notes Generator',
    description: 'Automatically summarizes lessons into key points and practice exercises',
    metrics: 'Instant summaries',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Code,
    title: 'AI Code Review',
    description: 'Automated feedback on programming assignments with best practices',
    metrics: '0-100 scoring',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    icon: CheckCircle,
    title: 'Adaptive Learning',
    description: 'AI adjusts difficulty and pace based on student performance patterns',
    metrics: 'Real-time adaptation',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
];

export function AIFeaturesShowcase() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered Learning
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Built with Advanced AI Technology
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the future of education with intelligent features powered by GPT-4,
            Claude, and custom ML models
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="relative overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-lg group"
              >
                <CardHeader>
                  <div className={`h-12 w-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="text-xs">
                    {feature.metrics}
                  </Badge>
                </CardContent>

                {/* Hover effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </Card>
            );
          })}
        </div>

        {/* Tech Stack Pills */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-4">Powered by</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['OpenAI GPT-4', 'Claude 3', 'Google Gemini', 'React Query', 'TypeScript', 'TailwindCSS'].map((tech) => (
              <Badge key={tech} variant="secondary" className="px-4 py-1.5">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'AI Features', value: '5+' },
            { label: 'Accuracy', value: '95%' },
            { label: 'Response Time', value: '<2s' },
            { label: 'Cost per Query', value: '$0.01' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold mb-1 gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
