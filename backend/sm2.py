from datetime import date, timedelta

def sm2(easiness: float, interval: int, repetitions: int, quality: int) -> tuple:
    if quality < 3:
        repetitions = 0
        interval = 1
    else:
        if repetitions == 0:
            interval = 1
        elif repetitions == 1:
            interval = 6
        else:
            interval = round(interval * easiness)

        easiness = easiness + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
        easiness = max(1.3, easiness)
        repetitions += 1

    due_date = (date.today() + timedelta(days=interval)).isoformat()
    return easiness, interval, repetitions, due_date