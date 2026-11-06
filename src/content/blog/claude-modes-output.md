---
title: "Claude מדבר יותר מדי? ההגדרות הנסתרות של Claude Code"
description: "סגנון התשובות, תצוגת השיחה ומצב העבודה ב-Claude Code: מה כל אחד עושה, מתי לבחור בו לפי Anthropic, ועל מה אני עובד."
pubDate: 2026-11-02
kicker: "מהסדנה"
standfirst: "שאלת שאלה של שורה וקיבלת פסקה? הוא מבקש אישור על כל דבר קטן? או שעשה משהו ואין לך מושג למה? בשביל כל אחד מאלה יש הגדרה, ורובן לא נמצאות על המסך."
readingTime: 5
draft: false
tags: ["עבודה עם AI", "קלוד", "Claude Code"]
payoff:
  title: "על מה אני עובד"
  items:
    - "Concise, כי הוא אוהב לדבר."
    - "Auto, כמעט כל הזמן."
    - "Plan, כשמתחילים משהו חדש."
# The chain: guy-hq/desk/2026-11-02-blog-modes-output/ (v2, published on his word 2.11).
---

כל אחת מהן נפתחת בלחיצה, וכדאי להכיר את שלושתן.

[על המודל ועל ה-effort כבר דיברנו](/blog/claude-models-effort/). אבל יש עוד שלוש: כמה Claude מדבר, כמה מהעבודה שלו אתה רואה, וכמה הוא שואל אותך לפני שהוא עושה משהו.

## כמה הוא מדבר: סגנון התשובות

Claude אוהב לדבר. הרבה.

סגנון התשובות, Output style, הוא סט הוראות שחל על כל תשובה בשיחה: כמה הוא כותב, באיזה טון, ובאיזה מבנה. ככה לא צריך לבקש "תקצר" בכל הודעה מחדש.

יש חמישה סגנונות, ולכל אחד מארבעת אלה שאינם ברירת המחדל, ב-Anthropic כתבו מתי לבחור בו:

<figure class="styles-cards" style="display:flex;flex-wrap:wrap;gap:10px;margin:24px 0;" dir="rtl" aria-label="חמשת סגנונות התשובה ומתי לבחור בכל אחד">
  <div style="flex:1 1 200px;min-width:0;border:1px solid var(--line);border-radius:12px;padding:12px 14px;">
    <div style="font-weight:700;color:var(--ink);text-align:right;" dir="ltr">Default</div>
    <div style="font-size:15px;">הרגיל. ההוראות שלו נכתבו לעבודה על קוד.</div>
    <div style="font-size:15px;margin-top:6px;"><strong>מתי:</strong> ברירת המחדל.</div>
  </div>
  <div style="flex:1 1 200px;min-width:0;border:2px solid var(--ink);border-radius:12px;padding:11px 13px;">
    <div style="font-weight:700;color:var(--ink);text-align:right;" dir="ltr">Concise</div>
    <div style="font-size:15px;">השורה הראשונה היא התשובה, בלי הקדמה ובלי סיכום.</div>
    <div style="font-size:15px;margin-top:6px;"><strong>מתי:</strong> כשהתשובות ארוכות ממה שאתה רוצה.</div>
    <div style="font-size:14px;font-weight:700;color:var(--acc-d);margin-top:4px;">על זה אני עובד</div>
  </div>
  <div style="flex:1 1 200px;min-width:0;border:1px solid var(--line);border-radius:12px;padding:12px 14px;">
    <div style="font-weight:700;color:var(--ink);text-align:right;" dir="ltr">Proactive</div>
    <div style="font-size:15px;">מתחיל לעבוד מיד, ומניח הנחות סבירות במקום לשאול.</div>
    <div style="font-size:15px;margin-top:6px;"><strong>מתי:</strong> כשאתה רוצה שימשיך בלי לעצור, ותתקן אותו אם טעה.</div>
  </div>
  <div style="flex:1 1 200px;min-width:0;border:1px solid var(--line);border-radius:12px;padding:12px 14px;">
    <div style="font-weight:700;color:var(--ink);text-align:right;" dir="ltr">Explanatory</div>
    <div style="font-size:15px;">מוסיף הסבר קצר על הבחירות שלו, בבלוק בשם <bdi>Insight</bdi>.</div>
    <div style="font-size:15px;margin-top:6px;"><strong>מתי:</strong> כשאתה רוצה להבין למה הוא עשה מה שעשה.</div>
  </div>
  <div style="flex:1 1 200px;min-width:0;border:1px solid var(--line);border-radius:12px;padding:12px 14px;">
    <div style="font-weight:700;color:var(--ink);text-align:right;" dir="ltr">Learning</div>
    <div style="font-size:15px;">מסביר, ומשאיר לך כמה שורות לכתוב בעצמך.</div>
    <div style="font-size:15px;margin-top:6px;"><strong>מתי:</strong> כשאתה רוצה ללמוד תוך כדי.</div>
  </div>
</figure>

**אני על Concise.** אני לא אוהב שהוא אוכל לי את הראש. שאלה פשוטה מקבלת משפט עד שלושה, והעבודה עצמה נעשית באותה יסודיות. רק הדיבור מתקצר. ומה שצריך כדי לא לטעות, כמו שגיאות ואזהרות, עדיין מגיע במלואו.

לא בטוח? משאירים על Default, ואם זה יותר מדי מילים, עוברים ל-Concise.

ושני דברים ששווה לדעת:

- **Explanatory ו-Learning כותבים יותר, ולכן משתמשים ביותר טוקנים.** Concise עושה את ההפך.
- **ב-Proactive הוא לא מפסיק לבקש אישורים.** את זה קובע מצב העבודה, למטה. וגם בו, לפני מחיקה של מידע, הוא אמור לשאול.

ואפשר לכתוב סגנון משלך. ב-Anthropic כותבים שסגנון כזה יכול להפוך את Claude למשהו שהוא לא מתכנת, למשל עוזר כתיבה או אנליסט נתונים. רק לזכור: סגנון הוא הוראה, לא הבטחה.

את הסגנון בוחרים בהגדרות של האפליקציה, ב-Output style.

## כמה רואים: תצוגת השיחה

ואפשר גם לראות איך הוא חושב.

לוחצים <bdi>Ctrl+O</bdi>, או פותחים את התפריט שליד שם השיחה ובוחרים Transcript view. יש שלוש רמות:

- **Normal**: התשובות המלאות, והפעולות מקופלות לשורת סיכום.
- **Thinking**: אותו דבר, ועוד החשיבה של Claude. מופיע רק אחרי שהוא כבר חשב בשיחה.
- **Verbose**: כל פעולה, כל קובץ שהוא קרא, כל צעד בדרך, וגם החשיבה.

מתי זה שימושי? כשהוא עשה משהו ואתה לא מבין למה. ב-Anthropic מציעים את Verbose בדיוק בשביל זה.

וזוכרים את השאלה [מהפוסט הקודם](/blog/claude-models-effort/), "הוא לא ידע מספיק, או שהוא לא התאמץ מספיק"? ב-Verbose רואים אילו קבצים הוא קרא ואיפה הוא עצר.

## כמה הוא שואל: מצב העבודה

בשורה שמתחת לתיבת הכתיבה, ליד שם המודל, יש כפתור שכתוב עליו המצב. לוחצים, ונפתח התפריט:

<figure style="margin:24px 0;">
  <img src="/blog/claude-modes-output/mode-menu.webp" alt="תפריט המצבים ב-Claude Code: Auto מסומן, ואחריו Manual, Accept edits, Plan ו-Bypass permissions. מתחתיו השורה שמתחת לתיבת הכתיבה: Opus 5.5, High, Auto" width="773" height="647" style="width:100%;max-width:420px;height:auto;border-radius:12px;display:block;margin:0 auto;">
</figure>

- **Auto**: מחליט לבד על ההרשאות. לפני פעולות כמו הרצת פקודות או פנייה לאינטרנט, מודל נפרד בודק שהן באמת מה שביקשת.
- **Manual**: שואל לפני כל שינוי. הכי הרבה שליטה, וגם הכי מציק.
- **Accept edits**: עורך קבצים לבד, ושואל לפני רוב הפקודות.
- **Plan**: קודם תוכנית, ורק אחרי שאישרת אותה, עבודה. מתאים כשמתחילים משהו חדש: מערכת, אתר, תהליך עבודה.
- **Bypass permissions**: ב-Anthropic כותבים שהוא רק לסביבות מבודדות, ושהוא לא מגן מפני פעולות שלא התכוונת אליהן. הוא לא בשבילנו.

אני עובד על Auto, בערך 99% מהזמן. הבודק חוסם, למשל, הורדה והרצה של קוד מהרשת, שליחת מידע רגיש החוצה, ומחיקה של קבצים שהיו לפני שהשיחה התחילה. ועדיין, Anthropic עצמם כותבים ש-Auto לא מבטיח בטיחות. הוא לעבודה שאתה סומך על הכיוון שלה.

לא נוח לך להתחיל ככה? אפשר להתחיל ב-Accept edits. וכשתשים לב שאתה עונה "כן" על כל שאלה שלו, עולים רמה.

## מה לעשות עכשיו

פותחים את ההגדרות של האפליקציה, ב-Output style בוחרים Concise.

ואם ליד שם המודל כתוב Auto, אין מה לשנות שם.
