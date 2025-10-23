# Basketball Club Story - Themed Area System Reference

## Overview
Basketball Club Story features **63 themed areas** created by combining 2-3 facilities. These combinations provide various bonuses to the club.

## Complete Themed Area List

| # | Name | Facility 1 | Facility 2 | Facility 3 | Effect |
|---|------|------------|------------|------------|--------|
| 1 | Rest Area | Bench | Vending Machine | - | Price +10G |
| 2 | Drink Area | Drink Stand | Vending Machine | - | Popular +5 |
| 3 | Restaurant Area | Pizza Parlor | Cafeteria | - | Price +20G |
| 4 | Food Truck Area | Crepe Truck | Kebab Wagon | - | Upkeep -50G |
| 5 | Study Area | School | Stationery Shop | Bookstore | Stock +15 |
| 6 | Team Activity Area | School | Gym | - | Exp +20 |
| 7 | Workout Area | Trampoline | Mini Practice Court | Sports Gym | Exp +10 |
| 8 | Serene Area | Bamboo Grove | Tea Parlor | - | Popular +7 |
| 9 | Power Area | Solar Panel | Solar Panel | - | Upkeep -50G |
| 10 | Snack Area | Fritter Stall | Crepe Truck | Popcorn Stall | Stock +10 |
| 11 | Team Support Area | Team Flag | Big Screen | - | Exp +12 |
| 12 | Fun Area | Ferris Wheel | Bouncy House | - | Price +100G |
| 13 | Hot and Toasty Area | Pizza Parlor | Fritter Stall | Kebab Wagon | Popular +15 |
| 14 | Yum Area | Restaurant | Cafeteria | - | Price +20G |
| 15 | Garden Area | Azalea | Camellia | - | Popularity +20 |
| 16 | Cooldown Area | Fountain | Pond | - | Popular +7 |
| 17 | Relaxation Area | Park | Fountain | Water Fountain | Upkeep -50G |
| 18 | Team Spirit Area | Locker Room | Storehouse | - | Exp +5 |
| 19 | Stocked Area | Merch Store | Official Merch Store | - | Exp +5 |
| 20 | Shopping Area | Merch Store | Boutique | - | Stock +7 |
| 21 | Event Area | Mini Practice Court | Shower Room | - | Exp +7 |
| 22 | Vacation Area | Movie Theater | Museum | - | Price +100G |
| 23 | Splash Area | Pool | Fishing Pond | Spa | Popular +25 |
| 24 | Recreation Area | Game Arcade | Toy Shop | - | Stock +10 |
| 25 | Resort Area | Hotel | Coconut Palm | - | Price +50G |
| 26 | Mystery Area | Fortune-teller | Watchmaker | - | Stock +5 |
| 27 | Music Area | CD Store | Music Shop | - | Upkeep -50G |
| 28 | Griddle Area | Movie Theater | Popcorn Stall | Drink Stand | Popular +15 |
| 29 | Daily Life Area | Dry Cleaner | Drugstore | Barber Shop | Upkeep -50G |
| 30 | Botanical Area | Florist | Shrub | - | Stock +7 |
| 31 | Oriental Area | Camellia | Pine Tree | Bamboo Grove | Upkeep -70G |
| 32 | Games Area | Game Arcade | Game Shop | - | Price +20G |
| 33 | Training Area | Sports Gym | Pool | - | Exp +20 |
| 34 | Seasonal Area | Azalea | Sunflower | Cosmos Flowerbed | Popular +7 |
| 35 | Topiary Area | Rabbit Topiary | Giraffe Topiary | Horse Topiary | Popular +7 |
| 36 | Snippy Area | Stationery Shop | Barber Shop | Florist | Stock +10 |
| 37 | Digital Area | Cell Phone Outlet | Big Screen | - | Upkeep -50G |
| 38 | Flower Area | Florist | Azalea | - | Stock +5 |
| 39 | Jump Area | Trampoline | Popcorn Stall | Rabbit Topiary | Price +20G |
| 40 | Break Area | Cafe | Tea Parlor | - | Popular +5 |
| 41 | Spa Area | Spa | Hotel | - | Popular +15 |
| 42 | Retro Area | Watchmaker | Museum | - | Upkeep -50G |
| 43 | Cool Area | Ice Cream Stand | Drink Stand | - | Stock +7 |
| 44 | Bench Area | Bench | White Bench | - | Upkeep -50G |
| 45 | Info Area | Newspaper Stand | Big Screen | - | Exp +10 |
| 46 | Kairo Area | Kairo House | Kairobot Statue | - | Popularity +25 |
| 47 | Paper Media Area | Bookstore | Newspaper Stand | Ticket Counter | Price +50G |
| 48 | Fishing Area | Fishing Pond | Pond | - | Upkeep -50G |
| 49 | Fashion Area | Shoe Store | Boutique | Watchmaker | Popular +15 |
| 50 | Hobby Area | Music Shop | Fishing Pond | Game Shop | Popular +20 |
| 51 | Girls Only Area | Fortune-teller | Ice Cream Stand | Crepe Truck | Stock +10 |
| 52 | Trendy Area | CD Store | Cell Phone Outlet | Drink Stand | Price +20G |
| 53 | Regulars Only Area | Cafeteria | Locker Room | - | Popular +5 |
| 54 | First Aid Area | Drugstore | Water Fountain | - | Upkeep -50G |
| 55 | Flowerbed Area | Bench | Cosmos Flowerbed | - | Popular +5 |
| 56 | Fast Food Area | Hamburger Stall | Drink Stand | - | Stock +5 |
| 57 | Summer Area | Sunflower | Pool | - | Popular +10 |
| 58 | Gentlemen's Area | Watchmaker | Barber Shop | - | Price +20G |
| 59 | Quick Dry Area | Dry Cleaner | Pond | - | Price +10G |
| 60 | Nature Area | Pine Tree | Pond | - | Upkeep -50G |
| 61 | Test Area | Shoe Store | Mini Practice Court | - | EXP +10 |
| 62 | Horse Area | Ticket Counter | Horse Topiary | - | Popular +10 |
| 63 | Tranquility Area | Bamboo Grove | Bamboo Grove | Bamboo Grove | Popular +7 |

## Bonus Types

### Revenue Bonuses
- **Price +10G to +100G**: Increases ticket/merchandise prices
- **Stock +5 to +15**: Increases merchandise inventory

### Operational Bonuses
- **Upkeep -50G to -70G**: Reduces maintenance costs
- **Popular +5 to +25**: Increases visitor attraction
- **Popularity +20 to +25**: Increases club fame

### Training Bonuses
- **Exp +5 to +20**: Increases player experience gain

## Implementation Strategy

### Phase 1: Core System
1. Facility placement grid system (isometric)
2. Adjacency detection algorithm
3. Themed area recognition engine
4. Bonus calculation and application

### Phase 2: Visual Feedback
1. Highlight themed areas when formed
2. Show bonus effects with animations
3. Display area names and bonuses in UI
4. Provide facility placement suggestions

### Phase 3: Optimization
1. AI-powered layout optimizer
2. Budget-based facility recommendations
3. Synergy calculator for planning
4. Save/load layout templates

## Technical Notes

- Facilities must be adjacent (within 1-2 tiles) to form themed areas
- Multiple themed areas can overlap
- Bonuses stack additively
- Some facilities can participate in multiple themed areas simultaneously
- Player needs to manually "Level Up" facilities to improve effects

