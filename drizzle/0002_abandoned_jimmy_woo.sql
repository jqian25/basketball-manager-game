CREATE TABLE `mapCustomObjects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`mapId` varchar(100) NOT NULL,
	`objectType` varchar(50) NOT NULL,
	`objectData` text NOT NULL,
	`isPurchased` boolean DEFAULT false,
	`purchasePrice` float,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`isActive` boolean DEFAULT true,
	CONSTRAINT `mapCustomObjects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `npcMarketplace` (
	`id` int AUTO_INCREMENT NOT NULL,
	`npcId` varchar(100) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`category` enum('student','teacher','coach','vendor','celebrity') NOT NULL,
	`basePrice` float NOT NULL,
	`premiumPrice` float,
	`defaultPersonality` text,
	`spriteSheet` text NOT NULL,
	`previewImage` text,
	`isAvailable` boolean DEFAULT true,
	`stockLimit` int,
	`soldCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `npcMarketplace_id` PRIMARY KEY(`id`),
	CONSTRAINT `npcMarketplace_npcId_unique` UNIQUE(`npcId`)
);
--> statement-breakpoint
CREATE TABLE `userNpcs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`npcMarketplaceId` int NOT NULL,
	`npcId` varchar(100) NOT NULL,
	`customName` varchar(100),
	`isPremium` boolean DEFAULT false,
	`aiConfig` text,
	`placement` text,
	`interactionCount` int DEFAULT 0,
	`lastInteractionAt` timestamp,
	`purchasedAt` timestamp NOT NULL DEFAULT (now()),
	`isActive` boolean DEFAULT true,
	CONSTRAINT `userNpcs_id` PRIMARY KEY(`id`)
);
