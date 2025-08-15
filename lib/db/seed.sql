-- Categories (Parent Categories)
INSERT INTO categories (name, slug, description, icon, parent_id, sort_order, is_active, updated_at, image_id) VALUES
                                                                                                                   ('Minecraft Hosting', 'minecraft-hosting', 'Minecraft server hosting with various modpacks and plugins', 'cube', NULL, 1, true, now(), 1),
                                                                                                                   ('Discord Bots', 'discord-bots', 'Discord bot hosting and development platforms', 'message-circle', NULL, 2, true, now(), 1),
                                                                                                                   ('Game Servers', 'game-servers', 'Popular game server hosting solutions', 'gamepad-2', NULL, 3, true, now(), 1),
                                                                                                                   ('Voice Servers', 'voice-servers', 'Voice communication server hosting', 'mic', NULL, 4, true, now(), 1),
                                                                                                                   ('Web Applications', 'web-applications', 'Custom web application and API hosting', 'code', NULL, 5, true, now(), 1),
                                                                                                                   ('Database Hosting', 'database-hosting', 'Database server hosting solutions', 'database', NULL, 6, true, now(), 1);

-- Subcategories (Child Categories)
INSERT INTO categories (name, slug, description, icon, parent_id, sort_order, is_active, updated_at, image_id) VALUES
-- Minecraft Hosting subcategories
('Vanilla Minecraft', 'vanilla-minecraft', 'Pure vanilla Minecraft server hosting', 'box', 1, 1, true, now(), 1),
('Spigot/Paper', 'spigot-paper', 'Spigot and Paper plugin-based Minecraft servers', 'puzzle', 1, 2, true, now(), 1),
('Modded Minecraft', 'modded-minecraft', 'Forge and Fabric modded Minecraft servers', 'wrench', 1, 3, true, now(), 1),
('BungeeCord/Velocity', 'bungeecord-velocity', 'Minecraft proxy servers for networks', 'network', 1, 4, true, now(), 1),
('Bedrock Edition', 'bedrock-edition', 'Minecraft Bedrock/Pocket Edition servers', 'smartphone', 1, 5, true, now(), 1),

-- Discord Bot subcategories
('Node.js Bots', 'nodejs-bots', 'Discord bots built with Node.js and Discord.js', 'terminal', 2, 1, true, now(), 1),
('Python Bots', 'python-bots', 'Discord bots built with Python and discord.py', 'code-2', 2, 2, true, now(), 1),
('Music Bots', 'music-bots', 'Specialized music streaming Discord bots', 'music', 2, 3, true, now(), 1),

-- Game Server subcategories
('FiveM (GTA V)', 'fivem-gta', 'Grand Theft Auto V FiveM roleplay servers', 'car', 3, 1, true, now(), 1),
('CS2/CS:GO', 'cs2-csgo', 'Counter-Strike 2 and CS:GO game servers', 'crosshair', 3, 2, true, now(), 1),
('Rust', 'rust-servers', 'Rust survival game server hosting', 'shield', 3, 3, true, now(), 1),
('ARK: Survival', 'ark-survival', 'ARK: Survival Evolved server hosting', 'zap', 3, 4, true, now(), 1),
('Garry''s Mod', 'garrys-mod', 'Garry''s Mod game server hosting', 'tool', 3, 5, true, now(), 1),
('Valheim', 'valheim-servers', 'Valheim co-op server hosting', 'mountain', 3, 6, true, now(), 1),
('DayZ', 'dayz-servers', 'DayZ survival server hosting', 'user-x', 3, 7, true, now(), 1),

-- Voice Server subcategories
('TeamSpeak', 'teamspeak', 'TeamSpeak voice server hosting', 'headphones', 4, 1, true, now(), 1),
('Mumble', 'mumble', 'Mumble voice server hosting', 'volume-2', 4, 2, true, now(), 1),

-- Web Application subcategories
('Node.js Apps', 'nodejs-apps', 'Node.js web application hosting', 'globe', 5, 1, true, now(), 1),
('Python Apps', 'python-apps', 'Python web application hosting', 'server', 5, 2, true, now(), 1),
('Custom Applications', 'custom-apps', 'Custom application hosting with Docker support', 'package', 5, 3, true, now(), 1),

-- Database subcategories
('MySQL/MariaDB', 'mysql-mariadb', 'MySQL and MariaDB database hosting', 'hard-drive', 6, 1, true, now(), 1),
('Redis', 'redis', 'Redis in-memory database hosting', 'zap', 6, 2, true, now(), 1);

-- Products for Vanilla Minecraft
INSERT INTO products (name, slug, description, category_id, ram_mb, cpu_cores, disk_gb, bandwidth, custom_limits, price_per_hour, is_active, is_popular, sort_order, integration_type, updated_at) VALUES
                                                                                                                                                                                                       ('Minecraft Starter', 'minecraft-starter', 'Perfect for small survival servers with friends', 7, 1024, 1, 5, 1000, '{"max_players": 10, "java_version": "17", "server_jar": "vanilla"}', 0.025, true, false, 1, 'minecraft_vanilla', now()),
                                                                                                                                                                                                       ('Minecraft Standard', 'minecraft-standard', 'Great for medium-sized community servers', 7, 2048, 2, 10, 2000, '{"max_players": 20, "java_version": "17", "server_jar": "vanilla"}', 0.050, true, true, 2, 'minecraft_vanilla', now()),
                                                                                                                                                                                                       ('Minecraft Premium', 'minecraft-premium', 'High-performance server for large communities', 7, 4096, 4, 20, 4000, '{"max_players": 50, "java_version": "17", "server_jar": "vanilla"}', 0.100, true, false, 3, 'minecraft_vanilla', now()),
                                                                                                                                                                                                       ('Minecraft Enterprise', 'minecraft-enterprise', 'Maximum performance for massive servers', 7, 8192, 8, 40, 8000, '{"max_players": 100, "java_version": "17", "server_jar": "vanilla"}', 0.200, true, false, 4, 'minecraft_vanilla', now());

-- Products for Spigot/Paper
INSERT INTO products (name, slug, description, category_id, ram_mb, cpu_cores, disk_gb, bandwidth, custom_limits, price_per_hour, is_active, is_popular, sort_order, integration_type, updated_at) VALUES
                                                                                                                                                                                                       ('Paper Basic', 'paper-basic', 'Entry-level Paper server with plugin support', 8, 1024, 1, 8, 1000, '{"max_players": 15, "java_version": "17", "server_jar": "paper", "plugin_support": true}', 0.033, true, false, 1, 'minecraft_paper', now()),
                                                                                                                                                                                                       ('Paper Standard', 'paper-standard', 'Standard Paper server for plugin-heavy servers', 8, 2048, 2, 15, 2000, '{"max_players": 30, "java_version": "17", "server_jar": "paper", "plugin_support": true}', 0.067, true, true, 2, 'minecraft_paper', now()),
                                                                                                                                                                                                       ('Paper Pro', 'paper-pro', 'High-performance Paper server for advanced setups', 8, 4096, 4, 30, 4000, '{"max_players": 60, "java_version": "17", "server_jar": "paper", "plugin_support": true}', 0.133, true, false, 3, 'minecraft_paper', now()),
                                                                                                                                                                                                       ('Paper Enterprise', 'paper-enterprise', 'Maximum performance Paper server', 8, 8192, 8, 60, 8000, '{"max_players": 120, "java_version": "17", "server_jar": "paper", "plugin_support": true}', 0.267, true, false, 4, 'minecraft_paper', now());

-- Products for Modded Minecraft
INSERT INTO products (name, slug, description, category_id, ram_mb, cpu_cores, disk_gb, bandwidth, custom_limits, price_per_hour, is_active, is_popular, sort_order, integration_type, updated_at) VALUES
                                                                                                                                                                                                       ('Forge Light', 'forge-light', 'Small modpack hosting for lightweight mods', 9, 3072, 2, 12, 2000, '{"max_players": 10, "java_version": "17", "server_type": "forge", "mod_support": true}', 0.083, true, false, 1, 'minecraft_forge', now()),
                                                                                                                                                                                                       ('Forge Standard', 'forge-standard', 'Medium modpack hosting for popular packs', 9, 4096, 3, 20, 3000, '{"max_players": 20, "java_version": "17", "server_type": "forge", "mod_support": true}', 0.125, true, true, 2, 'minecraft_forge', now()),
                                                                                                                                                                                                       ('Forge Heavy', 'forge-heavy', 'Heavy modpack hosting for complex mod setups', 9, 6144, 4, 35, 4000, '{"max_players": 25, "java_version": "17", "server_type": "forge", "mod_support": true}', 0.192, true, false, 3, 'minecraft_forge', now()),
                                                                                                                                                                                                       ('Forge Extreme', 'forge-extreme', 'Maximum performance for the largest modpacks', 9, 8192, 6, 50, 6000, '{"max_players": 30, "java_version": "17", "server_type": "forge", "mod_support": true}', 0.275, true, false, 4, 'minecraft_forge', now());

-- Products for BungeeCord/Velocity
INSERT INTO products (name, slug, description, category_id, ram_mb, cpu_cores, disk_gb, bandwidth, custom_limits, price_per_hour, is_active, is_popular, sort_order, integration_type, updated_at) VALUES
                                                                                                                                                                                                       ('BungeeCord Basic', 'bungeecord-basic', 'Basic proxy server for small networks', 10, 512, 1, 2, 5000, '{"max_players": 50, "java_version": "17", "server_jar": "bungeecord", "proxy": true}', 0.017, true, false, 1, 'minecraft_bungeecord', now()),
                                                                                                                                                                                                       ('Velocity Standard', 'velocity-standard', 'Modern proxy server with better performance', 10, 1024, 2, 4, 10000, '{"max_players": 200, "java_version": "17", "server_jar": "velocity", "proxy": true}', 0.033, true, true, 2, 'minecraft_velocity', now()),
                                                                                                                                                                                                       ('Velocity Pro', 'velocity-pro', 'High-capacity proxy for large networks', 10, 2048, 3, 6, 20000, '{"max_players": 500, "java_version": "17", "server_jar": "velocity", "proxy": true}', 0.067, true, false, 3, 'minecraft_velocity', now());

-- Products for Discord Bots (Node.js)
INSERT INTO products (name, slug, description, category_id, ram_mb, cpu_cores, disk_gb, bandwidth, custom_limits, price_per_hour, is_active, is_popular, sort_order, integration_type, updated_at) VALUES
                                                                                                                                                                                                       ('Bot Starter', 'bot-starter', 'Perfect for small Discord bots and testing', 12, 256, 1, 2, 1000, '{"node_version": "18", "npm": true, "database": "sqlite"}', 0.008, true, false, 1, 'nodejs', now()),
                                                                                                                                                                                                       ('Bot Standard', 'bot-standard', 'Great for medium-sized Discord bots', 12, 512, 1, 5, 2000, '{"node_version": "18", "npm": true, "database": "sqlite"}', 0.017, true, true, 2, 'nodejs', now()),
                                                                                                                                                                                                       ('Bot Premium', 'bot-premium', 'High-performance hosting for popular bots', 12, 1024, 2, 8, 4000, '{"node_version": "18", "npm": true, "database": "mysql"}', 0.033, true, false, 3, 'nodejs', now());

-- Products for Discord Bots (Python)
INSERT INTO products (name, slug, description, category_id, ram_mb, cpu_cores, disk_gb, bandwidth, custom_limits, price_per_hour, is_active, is_popular, sort_order, integration_type, updated_at) VALUES
                                                                                                                                                                                                       ('Python Bot Basic', 'python-bot-basic', 'Python Discord bot hosting for small bots', 13, 256, 1, 2, 1000, '{"python_version": "3.11", "pip": true, "database": "sqlite"}', 0.008, true, false, 1, 'python', now()),
                                                                                                                                                                                                       ('Python Bot Pro', 'python-bot-pro', 'Advanced Python bot hosting', 13, 512, 1, 5, 2000, '{"python_version": "3.11", "pip": true, "database": "mysql"}', 0.017, true, true, 2, 'python', now());

-- Products for FiveM (GTA V)
INSERT INTO products (name, slug, description, category_id, ram_mb, cpu_cores, disk_gb, bandwidth, custom_limits, price_per_hour, is_active, is_popular, sort_order, integration_type, updated_at) VALUES
                                                                                                                                                                                                       ('FiveM Starter', 'fivem-starter', 'Perfect for small FiveM roleplay servers', 15, 2048, 2, 15, 3000, '{"max_players": 32, "txadmin": true, "mysql": true}', 0.083, true, false, 1, 'fivem', now()),
                                                                                                                                                                                                       ('FiveM Standard', 'fivem-standard', 'Great for medium-sized FiveM communities', 15, 4096, 4, 30, 5000, '{"max_players": 64, "txadmin": true, "mysql": true}', 0.167, true, true, 2, 'fivem', now()),
                                                                                                                                                                                                       ('FiveM Premium', 'fivem-premium', 'High-performance FiveM server hosting', 15, 6144, 6, 50, 8000, '{"max_players": 128, "txadmin": true, "mysql": true}', 0.250, true, false, 3, 'fivem', now());

-- Products for CS2/CS:GO
INSERT INTO products (name, slug, description, category_id, ram_mb, cpu_cores, disk_gb, bandwidth, custom_limits, price_per_hour, is_active, is_popular, sort_order, integration_type, updated_at) VALUES
                                                                                                                                                                                                       ('CS2 Basic', 'cs2-basic', 'Entry-level Counter-Strike 2 server', 16, 1024, 2, 10, 5000, '{"max_players": 20, "tickrate": 64, "sourcemod": true}', 0.042, true, false, 1, 'source_engine', now()),
                                                                                                                                                                                                       ('CS2 Standard', 'cs2-standard', 'Standard CS2 server with SourceMod support', 16, 2048, 3, 20, 10000, '{"max_players": 32, "tickrate": 128, "sourcemod": true}', 0.083, true, true, 2, 'source_engine', now()),
                                                                                                                                                                                                       ('CS2 Pro', 'cs2-pro', 'Professional CS2 server for competitive play', 16, 4096, 4, 30, 15000, '{"max_players": 32, "tickrate": 128, "sourcemod": true, "gotv": true}', 0.167, true, false, 3, 'source_engine', now());

-- Products for Rust
INSERT INTO products (name, slug, description, category_id, ram_mb, cpu_cores, disk_gb, bandwidth, custom_limits, price_per_hour, is_active, is_popular, sort_order, integration_type, updated_at) VALUES
                                                                                                                                                                                                       ('Rust Basic', 'rust-basic', 'Small Rust server for private groups', 17, 4096, 3, 20, 5000, '{"max_players": 50, "world_size": 3000, "oxide": true}', 0.133, true, false, 1, 'rust', now()),
                                                                                                                                                                                                       ('Rust Standard', 'rust-standard', 'Standard Rust server for communities', 17, 6144, 4, 35, 8000, '{"max_players": 100, "world_size": 4000, "oxide": true}', 0.200, true, true, 2, 'rust', now()),
                                                                                                                                                                                                       ('Rust Premium', 'rust-premium', 'Large Rust server with maximum performance', 17, 8192, 6, 50, 12000, '{"max_players": 200, "world_size": 4000, "oxide": true}', 0.300, true, false, 3, 'rust', now());

-- Products for ARK: Survival
INSERT INTO products (name, slug, description, category_id, ram_mb, cpu_cores, disk_gb, bandwidth, custom_limits, price_per_hour, is_active, is_popular, sort_order, integration_type, updated_at) VALUES
                                                                                                                                                                                                       ('ARK Basic', 'ark-basic', 'Basic ARK server for small tribes', 18, 4096, 3, 25, 4000, '{"max_players": 20, "mods": true, "map": "The Island"}', 0.125, true, false, 1, 'ark', now()),
                                                                                                                                                                                                       ('ARK Standard', 'ark-standard', 'Standard ARK server with mod support', 18, 6144, 4, 40, 6000, '{"max_players": 50, "mods": true, "map": "custom"}', 0.192, true, true, 2, 'ark', now()),
                                                                                                                                                                                                       ('ARK Premium', 'ark-premium', 'High-performance ARK cluster server', 18, 8192, 6, 60, 8000, '{"max_players": 100, "mods": true, "cluster": true}', 0.275, true, false, 3, 'ark', now());

-- Products for TeamSpeak
INSERT INTO products (name, slug, description, category_id, ram_mb, cpu_cores, disk_gb, bandwidth, custom_limits, price_per_hour, is_active, is_popular, sort_order, integration_type, updated_at) VALUES
                                                                                                                                                                                                       ('TeamSpeak 10', 'teamspeak-10', 'TeamSpeak server for up to 10 users', 20, 256, 1, 1, 1000, '{"max_users": 10, "channels": 50, "server_groups": 25}', 0.004, true, false, 1, 'teamspeak', now()),
                                                                                                                                                                                                       ('TeamSpeak 25', 'teamspeak-25', 'TeamSpeak server for up to 25 users', 20, 512, 1, 2, 2000, '{"max_users": 25, "channels": 100, "server_groups": 50}', 0.008, true, true, 2, 'teamspeak', now()),
                                                                                                                                                                                                       ('TeamSpeak 100', 'teamspeak-100', 'TeamSpeak server for up to 100 users', 20, 1024, 2, 4, 4000, '{"max_users": 100, "channels": 500, "server_groups": 200}', 0.025, true, false, 3, 'teamspeak', now());

-- Products for Web Applications
INSERT INTO products (name, slug, description, category_id, ram_mb, cpu_cores, disk_gb, bandwidth, custom_limits, price_per_hour, is_active, is_popular, sort_order, integration_type, updated_at) VALUES
                                                                                                                                                                                                       ('Node.js Micro', 'nodejs-micro', 'Micro Node.js application hosting', 22, 256, 1, 2, 2000, '{"node_version": "18", "npm": true, "pm2": true}', 0.008, true, false, 1, 'nodejs', now()),
                                                                                                                                                                                                       ('Node.js Standard', 'nodejs-standard', 'Standard Node.js application hosting', 22, 512, 1, 5, 4000, '{"node_version": "18", "npm": true, "pm2": true}', 0.017, true, true, 2, 'nodejs', now()),
                                                                                                                                                                                                       ('Python Web Basic', 'python-web-basic', 'Basic Python web application hosting', 23, 512, 1, 3, 2000, '{"python_version": "3.11", "pip": true, "gunicorn": true}', 0.017, true, false, 1, 'python', now());

-- Products for Databases
INSERT INTO products (name, slug, description, category_id, ram_mb, cpu_cores, disk_gb, bandwidth, custom_limits, price_per_hour, is_active, is_popular, sort_order, integration_type, updated_at) VALUES
                                                                                                                                                                                                       ('MySQL Basic', 'mysql-basic', 'Basic MySQL database hosting', 25, 512, 1, 5, 1000, '{"version": "8.0", "max_connections": 50, "storage": "SSD"}', 0.017, true, false, 1, 'mysql', now()),
                                                                                                                                                                                                       ('MySQL Standard', 'mysql-standard', 'Standard MySQL database with better performance', 25, 1024, 2, 10, 2000, '{"version": "8.0", "max_connections": 100, "storage": "SSD"}', 0.033, true, true, 2, 'mysql', now()),
                                                                                                                                                                                                       ('Redis Basic', 'redis-basic', 'Basic Redis in-memory database', 26, 512, 1, 2, 1000, '{"version": "7.0", "persistence": true, "max_memory": "450MB"}', 0.025, true, false, 1, 'redis', now()),
                                                                                                                                                                                                       ('Redis Pro', 'redis-pro', 'Professional Redis hosting with clustering', 26, 1024, 2, 4, 2000, '{"version": "7.0", "persistence": true, "max_memory": "900MB", "clustering": true}', 0.050, true, true, 2, 'redis', now());