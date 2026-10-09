<?php

namespace App\Filament\Resources\ChecklistTemplates\Schemas;

use App\Models\Category;
use App\Models\Product;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

/**
 * Packing-list templates. New trips copy the template, so edits only affect trips created afterwards.
 */
class ChecklistTemplateForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make()
                    ->columns(2)
                    ->components([
                        TextInput::make('name')->required(),
                        TextInput::make('id')
                            ->label('Key')
                            ->required()
                            ->alphaDash()
                            ->unique(ignoreRecord: true)
                            ->disabledOn('edit')
                            ->helperText('A short permanent key, e.g. car-camping.'),
                        TextInput::make('description')->required()->columnSpanFull(),
                        TextInput::make('position')->numeric()->default(0)->helperText('Lower comes first.'),
                    ]),
                Repeater::make('sections')
                    ->collapsible()
                    ->itemLabel(fn (array $state) => $state['title'] ?? null)
                    ->addActionLabel('Add section')
                    ->components([
                        TextInput::make('title')->required(),
                        Repeater::make('items')
                            ->columns(3)
                            ->addActionLabel('Add item')
                            ->components([
                                TextInput::make('label')->required(),
                                Select::make('productSlug')
                                    ->label('Our pick')
                                    ->searchable()
                                    ->options(fn () => Product::orderBy('name')->pluck('name', 'slug')),
                                Select::make('gear')
                                    ->label('Or browse a type')
                                    ->options(fn () => self::gearOptions())
                                    // Stored as { category, subcategory }; edited as "category/subcategory".
                                    ->formatStateUsing(fn ($state) => is_array($state)
                                        ? "{$state['category']}/{$state['subcategory']}"
                                        : $state)
                                    ->dehydrateStateUsing(fn (?string $state) => $state
                                        ? array_combine(['category', 'subcategory'], explode('/', $state, 2))
                                        : null),
                            ]),
                    ]),
            ]);
    }

    /** @return array<string, array<string, string>> */
    private static function gearOptions(): array
    {
        return Category::with('subcategories')->orderBy('position')->get()
            ->mapWithKeys(fn ($c) => [$c->name => $c->subcategories
                ->mapWithKeys(fn ($s) => ["{$c->slug}/{$s->slug}" => $s->name])->all()])
            ->all();
    }
}
