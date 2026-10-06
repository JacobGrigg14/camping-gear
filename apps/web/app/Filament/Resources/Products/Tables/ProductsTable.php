<?php

namespace App\Filament\Resources\Products\Tables;

use App\Filament\Resources\Products\Schemas\ProductForm;
use App\Models\Category;
use App\Models\Product;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query) => $query->with(['subcategory.category', 'links']))
            ->defaultSort('name')
            ->columns([
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('brand')->searchable()->sortable(),
                TextColumn::make('subcategory.name')->label('Type')->sortable(),
                TextColumn::make('price_tier')->label('Price'),
                TextColumn::make('rating')->numeric(1)->sortable(),
                IconColumn::make('featured')->boolean(),
                TextColumn::make('live_links')
                    ->label('Live links')
                    ->state(fn (Product $record) => $record->links->filter(fn ($l) => filled($l->url))->count()
                        .' / '.$record->links->count()),
            ])
            ->filters([
                SelectFilter::make('category')
                    ->options(fn () => Category::orderBy('position')->pluck('name', 'id'))
                    ->query(fn (Builder $query, array $data) => $data['value']
                        ? $query->whereHas('subcategory', fn ($q) => $q->where('category_id', $data['value']))
                        : $query),
                SelectFilter::make('price_tier')->label('Price')->options(ProductForm::PRICE_TIERS),
                TernaryFilter::make('featured'),
                TernaryFilter::make('pending_links')
                    ->label('Affiliate links')
                    ->trueLabel('Some links still pending')
                    ->falseLabel('All links live')
                    ->queries(
                        true: fn (Builder $q) => $q->whereHas('links', fn ($l) => $l->whereNull('url')->orWhere('url', '')),
                        false: fn (Builder $q) => $q->whereDoesntHave('links', fn ($l) => $l->whereNull('url')->orWhere('url', '')),
                    ),
            ])
            ->recordActions([
                Action::make('view')
                    ->label('View on site')
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->url(fn (Product $record) => $record->path(), shouldOpenInNewTab: true),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
