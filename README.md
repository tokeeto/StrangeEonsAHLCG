---

> ### **⚠️ Fork Notice: SE 3.4+ Development Branch**
>
> This is a personal fork of Tokeeto's official Arkham Horror LCG plugin.
>
> The `master` branch of this fork is kept in sync with the official repository. For experimental fixes and optimizations specifically for the upcoming **Strange Eons 3.4 alpha**, please see the branches listed below.
>
> **Development Branches:**
> *   **[`fix/font-and-layout-for-se34`](https://github.com/polochamps/StrangeEonsAHLCG/tree/fix/font-and-layout-for-se34)**: Contains fixes for font rendering and layout issues introduced by the move to Java 11 in SE 3.4. **(Work in Progress)**
>
> **Warning:** Using plugins built from these development branches on older, stable versions of Strange Eons (like 3.3) may result in visual inconsistencies.
>
> ---
> The official repository for the stable plugin can be found here:
> [https://github.com/tokeeto/StrangeEonsAHLCG](https://github.com/tokeeto/StrangeEonsAHLCG)
> ---

---


An Arkham Horror LCG plugin for Strange Eons.

This is a fork of the original AHLCG plugin by Pilute23/JaqenZann

# How to use
0. Download and install [Strange Eons](https://cgjennings.ca/eons/) by C.G.Jennings.
1. Download ArkhamHorrorLCG.seext (Strange Eons Extension file) found in ArkhamHorrorLCG/ArkhamHorrorLCG.seext
2. Drag the file into SE while open - that should install it.
3. Create new content for Arkham Horror LCG and share it with the community. Repeat ad infinitum.

Note that the ArkhamHorrorLCG plugin found in the StrangeEons built-in plugin repository is outdated by this point. It works fine, it just doesn't have all the changes and fixes found here.

# How to contribute
If you wish to make changes to the AHLCG plugin yourself, and potentially make a pull request, here's how to do it:

1. Clone/download this repository
2. Add the `/ArkhamHorrorLCG/ArkhamHorrorLCG` (yes, the second subfolder of the same name) folder to a SE project. This will make it easier to build and test. (If you're on linux, you can symlink to this folder for easier access.)
3. Open the Plugin folder in SE, find the file you want to change, and make changes.
4. Right-click on the Plugin folder in SE, and click "test plugin". This will open up a test instance of SE with your new version installed.
5. Repeat steps 3-4 until you're satisfied.
6. Copy back the changes (if you symlinked the folders, skip this step).
7. Make sure to copy over the new .seext file as well
8. Make a pull request with your changes, and a solid description of what they fix.

## What even is github?
This "step by step" guide is a bit superficial - this is because git and github usage is outside the scope of this guide. If you've made a change and what to contribute it, but don't know how, message me wherever you can find me. I'm @tokeeto on discord, message me directly, or in the #eons-development channel on the Mythosbusters discord server. (I prefer the latter, but you don't have to join a server just for that.)

## What is java and javascript?
Programming in general is also outside the scope of this guide, but many this can be changed without knowing exactly why it works the way it does.

Generally, cards are handled by a `diy/CardType.js` file, and a `settings/AHLCG-CardType.setting` file. In there, a lot of stuff, like location on card, text alignment, color, font type, are plainly readable and can be changed. More advanced stuff, like showing/hiding stuff under certain conditions, requires javascript knowledge.

## What's a useful change?
I generally accept any quality improvements, or custom additions - like new slot icons, or card types - but please make sure to test that it works across different OS's. If you can't (most of us can't) make sure to note which OS you've been making your change for, so I can find someone to test it out elsewhere. There are minor rendering differences between OS's, so not all discrepancies are worth fixing (as it's simply a question of who's gonna get the short end of the stick).

I will not accept the inclusion of Arno fonts, as we don't have distribution rights for those.

I will, in most cases, not accept deviations from the official cards, simply because you think it looks better. Some people use this project to create errata cards, or "return to" style content, and need it to match.

I will, as noted above, accept additional versions of cards, that deviate from the official products.

And generally, try to ensure that your feature is "complete". If you add a new class, make sure that it's available for all applicable cards for instance.
