import { Search, SlidersHorizontal, X } from 'lucide-react';

import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';

import { Input } from '../ui/input';
import {categories, levels } from '@/data/mockData';


interface CourseFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedLevel: string;
  onLevelChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  activeFiltersCount: number;
  onClearFilters: () => void;
}

export function CourseFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedLevel,
  onLevelChange,
  sortBy,
  onSortChange,
  activeFiltersCount,
  onClearFilters,
}: CourseFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title or instructor..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedLevel} onValueChange={onLevelChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear filters
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          </Button>
        )}
      </div>
    </div>
  );
}
