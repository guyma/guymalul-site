---
title: "מודל ו-effort ב-Claude Code: מה זה, ולמה רוב הזמן לא צריך לגעת"
description: "מה אומרים השמות Haiku, Sonnet, Opus ו-Fable, מה ההבדל בין המודלים, מה זה effort, ועם מה לעבוד רוב הזמן."
pubDate: 2026-11-02
kicker: "מהסדנה"
standfirst: "פותחים את Claude Code, ויש שם תפריט עם שמות שנשמעים כמו שיעור ספרות: Fable, Opus, Sonnet, Haiku. לידו יש עוד כפתור, שנקרא effort. מה אמורים לבחור פה?"
readingTime: 4
draft: false
tags: ["מודלים", "עבודה עם AI", "קלוד"]
payoff:
  title: "רוב הזמן"
  items:
    - "Opus על medium. זו ברירת המחדל, לא צריך לגעת."
    - "משימה מסובכת יותר? מעלים ל-high."
    - "נגמרה המכסה? עוברים ל-Sonnet, באמצע השיחה."
# The chain: guy-hq/desk/2026-11-01-blog-models-effort/ (v2, published on his word 2.11).
---

את מה שכבר נבחר שם.

ברירת המחדל טובה, ולרוב לא צריך לגעת בה. אבל שווה להבין מה יש שם, כי ככה יודעים מתי כן.

## למה קוראים להם ככה

שלושה מהשמות הם צורות של כתיבה.

**Haiku** הוא שיר יפני של שלוש שורות. **Sonnet**, סונטה, הוא שיר של ארבע עשרה שורות. **Opus** זה "יצירה" בלטינית, כמו ב-magnum opus, יצירת המופת.

שיר קצרצר, שיר בינוני, יצירה שלמה. וככה בדיוק מסודרים המודלים, מהבסיסי למתקדם.

הסבר רשמי לשמות לא מצאתי אצל Anthropic. כשהשיקו את השלושה, ב-2024, הם כתבו רק שהם מסודרים "בסדר עולה של יכולת". אבל קשה לא לשים לב.

והרביעי, **Fable**, הגיע ב-2026 ויושב מעל כולם. עליו דווקא יש הסבר: מלטינית fabula, "מה שמסופר", קרוב למילה היוונית mythos. כבר לא שיר, סיפור.

## ארבע רמות של מוח

המודל הוא המוח. Anthropic בונים אותו בארבע רמות, וככה הם עצמם מתארים כל אחת:

<figure class="brain-ladder" style="display:flex;justify-content:center;align-items:flex-start;gap:8px;margin:28px 0;" dir="rtl" aria-label="ארבע רמות של מודל: Fable, מומחה שראה בעיות נדירות. Opus, מומחה. Sonnet, איש מקצוע כללי. Haiku, מהיר, למשימות פשוטות">
  <div style="flex:1 1 0;min-width:0;text-align:center;">
    <div style="height:100px;display:flex;align-items:flex-end;justify-content:center;"><img src="/blog/claude-models-effort/brain.webp" alt="" width="108" height="100" style="height:100px;width:auto;max-width:100%;"></div>
    <div style="font-weight:700;color:var(--ink);" dir="ltr">Fable</div>
    <div style="font-size:14px;line-height:1.35;">מומחה שראה בעיות נדירות</div>
  </div>
  <div style="flex:1 1 0;min-width:0;text-align:center;">
    <div style="height:100px;display:flex;align-items:flex-end;justify-content:center;"><img src="/blog/claude-models-effort/brain.webp" alt="" width="86" height="80" style="height:80px;width:auto;max-width:100%;"></div>
    <div style="font-weight:700;color:var(--ink);" dir="ltr">Opus</div>
    <div style="font-size:14px;line-height:1.35;">מומחה</div>
  </div>
  <div style="flex:1 1 0;min-width:0;text-align:center;">
    <div style="height:100px;display:flex;align-items:flex-end;justify-content:center;"><img src="/blog/claude-models-effort/brain.webp" alt="" width="65" height="60" style="height:60px;width:auto;max-width:100%;"></div>
    <div style="font-weight:700;color:var(--ink);" dir="ltr">Sonnet</div>
    <div style="font-size:14px;line-height:1.35;">איש מקצוע כללי, ממש טוב</div>
  </div>
  <div style="flex:1 1 0;min-width:0;text-align:center;">
    <div style="height:100px;display:flex;align-items:flex-end;justify-content:center;"><img src="/blog/claude-models-effort/brain.webp" alt="" width="45" height="42" style="height:42px;width:auto;max-width:100%;"></div>
    <div style="font-weight:700;color:var(--ink);" dir="ltr">Haiku</div>
    <div style="font-size:14px;line-height:1.35;">מהיר, למשימות פשוטות</div>
  </div>
</figure>

**אז מה בעצם שונה ביניהם?**

כל מודל אומן פעם אחת, ומה שהוא יודע נקבע שם. מודל חזק יותר יודע יותר, ומסתדר טוב יותר עם בעיות קשות. כמה מידע בדיוק כל אחד מהם ראה באימון, את זה לא מצאתי אצלם.

והמחיר עולה עם הרמה. Opus יקר פי שניים מ-Sonnet לפי המחירון של Anthropic, ו-Fable יקר מכולם. בחלק מהמנויים Fable בכלל לא נכנס למכסה, ומשלמים עליו מקרדיט נוסף.

## effort: כמה הוא משקיע

זה הכפתור השני, והוא לא קשור לרמה של המודל.

**זה לא כמה המוח חכם. זה כמה הוא משקיע בחשיבה.**

<figure class="two-dials" style="display:flex;flex-wrap:wrap;gap:12px;margin:28px 0;" dir="rtl" aria-label="שני כפתורים נפרדים. המודל: כמה הוא יודע, מ-Haiku עד Fable, ברירת המחדל Opus. ה-effort: כמה הוא משקיע, מ-low עד max, ברירת המחדל medium">
  <div style="flex:1 1 240px;min-width:0;border:1px solid var(--line);border-radius:12px;padding:14px 16px;background:var(--ground);">
    <div style="font-weight:700;color:var(--ink);">הכפתור הראשון: המודל</div>
    <div style="font-size:15px;margin-bottom:10px;">כמה הוא יודע</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;" dir="ltr">
      <span style="border:1px solid var(--line);border-radius:999px;padding:2px 10px;font-size:14px;">Haiku</span>
      <span style="border:1px solid var(--line);border-radius:999px;padding:2px 10px;font-size:14px;">Sonnet</span>
      <span style="border:2px solid var(--ink);border-radius:999px;padding:1px 10px;font-size:14px;font-weight:700;color:var(--ink);">Opus</span>
      <span style="border:1px solid var(--line);border-radius:999px;padding:2px 10px;font-size:14px;">Fable</span>
    </div>
    <div style="font-size:14px;margin-top:8px;">ברירת המחדל: <bdi>Opus</bdi></div>
  </div>
  <div style="flex:1 1 240px;min-width:0;border:1px solid var(--line);border-radius:12px;padding:14px 16px;background:var(--ground);">
    <div style="font-weight:700;color:var(--ink);">הכפתור השני: ה-effort</div>
    <div style="font-size:15px;margin-bottom:10px;">כמה הוא משקיע</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;" dir="ltr">
      <span style="border:1px solid var(--line);border-radius:999px;padding:2px 10px;font-size:14px;">low</span>
      <span style="border:2px solid var(--ink);border-radius:999px;padding:1px 10px;font-size:14px;font-weight:700;color:var(--ink);">medium</span>
      <span style="border:1px solid var(--line);border-radius:999px;padding:2px 10px;font-size:14px;">high</span>
      <span style="border:1px solid var(--line);border-radius:999px;padding:2px 10px;font-size:14px;">xhigh</span>
      <span style="border:1px solid var(--line);border-radius:999px;padding:2px 10px;font-size:14px;">max</span>
    </div>
    <div style="font-size:14px;margin-top:8px;">ברירת המחדל: <bdi>medium</bdi></div>
  </div>
</figure>

ולהשקיע זה לא רק לחשוב יותר זמן. זה כמה קבצים הוא קורא, כמה הוא בודק את עצמו, וכמה צעדים הוא עושה לבד לפני שהוא חוזר לשאול אותך.

יש חמש רמות:

- **low**: לשיחה מהירה, כשאתה בודק כל תשובה בעצמך.
- **medium**: לעבודה היומיומית, משימה ברורה. ברירת המחדל של Opus.
- **high**: כשחשוב שיבדוק את עצמו, או כשיש הרבה מצבים שעלולים להשתבש.
- **xhigh**: עוד יותר לעומק, במחיר של יותר טוקנים.
- **max**: לבעיה קשה שאתה רוצה שיעבוד עליה לבד. ב-Anthropic כותבים שברמה הזאת הוא עלול לחשוב יותר מדי. והיא לא נשמרת: היא רק לשיחה הנוכחית.

**ואיך יודעים מתי לשנות?** כשהתשובה יצאה חלשה, ב-Anthropic מציעים לשאול שאלה אחת:

<figure class="fork" style="margin:28px 0;" dir="rtl" aria-label="השאלה: הוא לא ידע מספיק, או שהוא לא התאמץ מספיק? אם לא ידע, מודל חזק יותר. אם לא התאמץ, effort גבוה יותר">
  <div style="text-align:center;font-weight:700;color:var(--ink);border:1px solid var(--line);border-radius:12px;padding:12px 16px;background:var(--tone);">הוא לא ידע מספיק, או שהוא לא התאמץ מספיק?</div>
  <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:12px;">
    <div style="flex:1 1 220px;min-width:0;border:1px solid var(--line);border-radius:12px;padding:12px 16px;">
      <div style="font-weight:700;color:var(--ink);">לא ידע מספיק</div>
      <div style="font-size:15px;margin:4px 0 8px;">נתת לו את כל מה שצריך, הוא ניסה, ועדיין טעה.</div>
      <div style="font-weight:700;color:var(--acc-d);">← מודל חזק יותר</div>
    </div>
    <div style="flex:1 1 220px;min-width:0;border:1px solid var(--line);border-radius:12px;padding:12px 16px;">
      <div style="font-weight:700;color:var(--ink);">לא התאמץ מספיק</div>
      <div style="font-size:15px;margin:4px 0 8px;">דילג על קובץ, לא בדק, עצר באמצע.</div>
      <div style="font-weight:700;color:var(--acc-d);">← <bdi>effort</bdi> גבוה יותר</div>
    </div>
  </div>
</figure>

## אז עם מה עובדים רוב הזמן?

עם מה שכבר מוגדר. ב-Claude Code, במנויים Pro, Max, Team ו-Enterprise, ברירת המחדל היא Opus על medium.

ככה אני עובד בעצמי. כשמשימה קצת יותר מסובכת, אני מעלה ל-high.

ומה אם המכסה נגמרת? עוברים ל-Sonnet. אפשר להחליף מודל באמצע השיחה, בלי לאבד אותה.

ועוד דבר שחוסך הרבה מכסה: כשעוברים למשימה חדשה, פותחים שיחה חדשה. כל הודעה שולחת איתה את כל השיחה מההתחלה, אז שיחה ארוכה שקופצת בין נושאים משלמת על כולם, בכל הודעה מחדש.

## מה לעשות עכשיו

פותחים את Claude Code באפליקציה, ומסתכלים בשורה שמתחת לתיבת הכתיבה, בצד ימין. כתוב שם על איזה מודל עובדים, ולידו <span style="white-space:nowrap">ה-effort</span>.

כתוב Opus ו-medium? מעולה. אין מה לשנות.

כתוב משהו אחר? לוחצים עליו ובוחרים מחדש.
