from celery import shared_task


@shared_task
def calculate_recommendations():
    return "Recommendations calculated"
