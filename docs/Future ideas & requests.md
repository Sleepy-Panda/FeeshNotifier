- Pet price as diff between lvl 1 and lvl 100
- Remove double hook reindrake logic because DH is not possible now
- Probably remove calculation of profits in Pulse Rings
- Total price is set to 0 in Profit tracker while other lines being normal (very rare and seems random).
- Sea creatures/hour
- Alert when a new bottle type charged (LF message)
- Rain/Thunder widget
- Find out price calculation for Kuudra Keys in profit tracker
- Achievements (ScathaPro / SBO as reference)
- Party chat commands
  - !feeshsincejawbus
  - !feeshsincethunder
  - !feeshsinceyeti
  - !feeshsincereindrake
  - !feeshsincevial
  - !feeshvials
  - !kdr - kills/deaths rate for thunder/jawbus [requires API key and custom backend]
  - Commands cooldown so people do not spam
  - /feeshkdr <player> - to check myself or someone privately without sending to the party chat [requires API key and custom backend]
- Customized sounds
  - Sounds folder: assets
  - Ability to open folder from settings
  - Ability to test sound from settings
  - Toggle setting to enable customization
- Sea creatures/hour, profit/hour
- Render mob immunity flag
- Highlight rare sea creatures
- Short catch messages and double hook messages
- Total and session tracker
- Trading with other players adds items to the profit trackers
- Multiple drops that happen at the same time lead to "You're sending messages too fast" error.
- Personal cap alert (20 for CH, 5 for Crimson)
- Expertise widget
- Fishing XP tracker
- Attach Vials drop number to the pchat message
- Track all mobs caught, not only rare
- Golden fish timer
"can you add a golden fish timer tracker into this? i only have golden fish diamond left and i like playing other games while just having my bobber in lava, and setting a 15min timer every time is p annoying lmao"
- Bait changed / Bait missing alert
"i think a feature that says im out of whale bait / fish bait / carrot bait would be cool to add because sometimes im just watching video and i realise im out of bait after like 30 mins."
- "I was gonna say maybe add a feature that also keeps track of the cost of fish baits while fishing would be pretty cool"
  - Probably same for buying rain

Refactoring:

- Do not run registers if feature is disabled.
- [Faangorn] Profit tracker causes lags after a while (memory consumption grows)







Achievements prototype:

Unlocked: X/Total (%)
Sort by: rarity, locked/unlocked

- Crimson
  - [EASY] Catch your first Thunder
  - [EASY] Catch your first Jawbus
  - Get your first vial
  - Lootshare a vial
  - Get 25 vials (requires tracker to be enabled)
  - 400+ MF on vial (or 450?)
  - < 150 MF on vial. A non killed it, I swear!
  - No vial for 300 Jawbuses (requires tracker to be enabled) (Do I have negative MF?)
  - Full jawbus bestiary
  - 10 10 rod
  - Double hook Jawbus
  - B2B thunder (requires tracker to be enabled)
  - B2B2B thunder (requires tracker to be enabled)
  - B2B Jawbus (requires tracker to be enabled)
  - [EASY] Smth with deaths  (Wait, what is this white circle?.. <player> was killed by Thunder.)
  - No jawbus for 1000 catches (check that in magma lord)
  - No jawbus for 3000 catches (check that in magma lord)
- Jerry
  - No yeti for 1000 catches (requires tracker to be enabled)
  - No reindrake for 3000 catches (requires tracker to be enabled)
  - Lootshare a baby yeti
  - B2b yeti (requires tracker to be enabled)
  - B2B2B yeti (requires tracker to be enabled)
  - Get a yeti pet with less than 50 MF
  - Smth with tons of nutcrackers (requires tracker to be enabled)
  - Fish the entire event (spend ~9 hours)
- Spooky
  - 2 orbs in 10 seconds
- Ink
  - Squid / night squid leaderboard
  - Ink sack collection leaderboard?
- CH
  - Get N magma cores in 10 seconds
- Water
  - Get 2 lucky clover cores in 10 seconds
  - Full oasis bestiary (It was so much fun... Sigh / Useless grind)
- Marina
  - Get 400+ sharks per festival
- Trophy
  - Gold hunter
  - DIamond hunter
- Treasure
  - Catch legendary squid / guardian
  - The same as above, but 2x (blessing)
- Dye
  - Obtain aquamarine / iceberg / etc dye
- Giant rod
- Dirt fishing - get worm the fish
- Equip 10 10 magma lord set
- 1B exp overflow
- ? exp overflow
- Top 10 in any fishing leaderboard
- Top 1 in any fishing leaderboard (mobs, trophy, collection, ...)
- All fishing bestiaries complete
- Be in party with me :3

- Do not count on Alpha
- 1s timeout after the main event