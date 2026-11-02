---
title: "אפשר לעבוד עם Claude Code מהטלפון? כן, בתנאי אחד"
description: "איפה Claude Code רץ, מה זה Remote Control ואיך מדליקים אותו, ומתי בכלל צריך את הענן."
pubDate: 2026-11-02
kicker: "מהסדנה"
standfirst: "זו שאלה שכל הזמן שואלים אותי בסדנה. התשובה קצרה, אבל כדי להבין את התנאי שלה, צריך לדעת איפה Claude באמת רץ."
readingTime: 4
draft: false
tags: ["עבודה עם AI", "קלוד", "Claude Code"]
payoff:
  title: "TL;DR"
  items:
    - "Claude רץ על המחשב שלך, על Local. הטלפון הוא רק חלון אל השיחה."
    - "התנאי: המחשב שעליו המשרד דלוק, והאפליקציה פתוחה."
    - "מדליקים: בהגדרות, תחת Claude Code, Connect new sessions to Remote Control."
    - "בטלפון: אפליקציית Claude, ואז Code."
    - "למי שרוצה: Keep computer awake while Claude works, כדי שהמחשב לא ייכנס למצב שינה באמצע עבודה."
    - "הענן: לשלב מתקדם, כשצריך שמשימה תמשיך גם כשהמחשב כבוי."
# The chain: guy-hq/desk/2026-11-02-blog-remote/ (v2, published on his word 2.11).
---

כן, כל עוד המחשב שהמשרד שלך יושב עליו דלוק.

## איפה Claude רץ

לפני שמתחילים שיחה, בוחרים ליד תיבת הכתיבה את הסביבה: איפה Claude רץ. זו בחירה כמו [מצב העבודה](/blog/claude-modes-output/), רק על המקום ולא על ההרשאות.

- **Local**: על המחשב שלך, עם גישה ישירה לקבצים שלך. המשרד שלך נמצא כאן.
- **Cloud**: על מחשב של Anthropic. הוא ממשיך לעבוד גם אם סגרת את האפליקציה או כיבית את המחשב, אבל הוא עובד על מאגר ב-GitHub, לא על התיקייה שלך.

יש עוד שתי אפשרויות, למחשב מרוחק שלך ול-WSL ב-Windows. הן לא בשבילנו כרגע.

בסדנה אני אומר: תשאירו על Local. הענן זה כבר שלב מתקדם.

## Remote Control: המחשב עובד, אתה בכל מקום

Remote Control מחבר את אפליקציית Claude בטלפון, או דפדפן במחשב אחר, לשיחה שרצה על המחשב שלך.

<figure class="rc-window" style="display:flex;flex-wrap:wrap;gap:12px;align-items:stretch;margin:28px 0;" dir="rtl" aria-label="המחשב שעליו המשרד, דלוק: שם המשרד, הקבצים ו-Claude, ושם הכל רץ. לידו הטלפון, ודפדפן במחשב אחר, כל אחד חלון אל אותה שיחה">
  <div style="flex:1 1 230px;min-width:0;border:2px solid var(--ink);border-radius:12px;padding:14px 16px;">
    <div style="font-weight:700;color:var(--ink);">המחשב שעליו המשרד, דלוק</div>
    <div style="font-size:15px;margin-top:4px;">המשרד, הקבצים, ו-Claude עצמו</div>
    <div style="font-size:14px;font-weight:700;color:var(--acc-d);margin-top:8px;">הכל רץ כאן</div>
  </div>
  <div style="flex:1 1 230px;min-width:0;display:flex;flex-direction:column;gap:8px;">
    <div style="border:1px solid var(--line);border-radius:12px;padding:10px 14px;">
      <div style="font-weight:700;color:var(--ink);">הטלפון</div>
      <div style="font-size:15px;">חלון אל השיחה</div>
    </div>
    <div style="border:1px solid var(--line);border-radius:12px;padding:10px 14px;">
      <div style="font-weight:700;color:var(--ink);">דפדפן במחשב אחר</div>
      <div style="font-size:15px;">חלון אל אותה שיחה</div>
    </div>
  </div>
</figure>

Claude ממשיך לרוץ על המחשב שלך, עם הקבצים שלך. מהטלפון אתה רק רואה ושולח: הודעות, וגם תמונות וקבצים. והשיחה זהה בכל מקום, כך שאפשר להתחיל ליד המחשב ולהמשיך מהספה.

וזה בדיוק התנאי. המשרד שלך יושב על מחשב אחד, וכל עוד הוא דלוק, אפשר להתחבר אליו מכל מקום.

**איך מדליקים?** בהגדרות של האפליקציה, תחת Claude Code, יש **Connect new sessions to Remote Control**. כשהוא דלוק, כל שיחה חדשה מתחברת לבד. ואפשר גם לשיחה אחת: בפרטי השיחה יש מתג Remote Control.

**ומהטלפון?** פותחים את אפליקציית Claude ונכנסים ל-Code. השיחה מופיעה ברשימה עם אייקון של מחשב, ונקודה ירוקה כשהיא מחוברת.

כמה דברים שכדאי לדעת:

- **אם המחשב נכנס למצב שינה או האינטרנט נפל**, השיחה מתחברת מחדש לבד כשהמחשב חוזר. ובהגדרות יש עוד אחת, **Keep computer awake while Claude works**: היא מונעת מהמחשב להיכנס למצב שינה בזמן ש-Claude עובד. סגירת המכסה עדיין מכניסה אותו למצב שינה.
- **אם סגרת את האפליקציה**, השיחה מתנתקת עד שתפתח אותה שוב.
- **זה זמין במנויים Pro, Max, Ultra, Team ו-Enterprise.** ב-Team וב-Enterprise זה כבוי בהתחלה, ומי שמנהל את החשבון צריך להדליק.
- **בזמן שהשיחה מחוברת, התוכן שלה נשמר אצל Anthropic.** העבודה עצמה והקבצים נשארים על המחשב שלך.

## ומה עם הענן?

ב-Anthropic מציעים חלוקה פשוטה: Remote Control כשאתה באמצע עבודה על המחשב ורוצה להמשיך ממכשיר אחר. שיחה בענן כשרוצים להתחיל משימה בלי הכנות על המחשב, או להריץ כמה משימות במקביל, או משימה ארוכה שתמשיך גם כשהמחשב כבוי.

מה שאני ממליץ בהתחלה: לא לרוץ לענן. להשאיר מחשב אחד דלוק, עם המשרד עליו, ולהתחבר אליו מהטלפון. זה יכול להיות סתם מחשב, העיקר שיהיה דלוק.

## מה לעשות עכשיו

פותחים את ההגדרות של האפליקציה ומדליקים את Connect new sessions to Remote Control.

ואז מורידים לטלפון את אפליקציית Claude, נכנסים ל-Code, והשיחה שלך מחכה שם.
