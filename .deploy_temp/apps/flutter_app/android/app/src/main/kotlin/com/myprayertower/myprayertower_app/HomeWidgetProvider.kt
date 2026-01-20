package com.myprayertower.myprayertower_app

import android.appwidget.AppWidgetManager
import android.content.Context
import android.content.SharedPreferences
import android.widget.RemoteViews
import es.antonborri.home_widget.HomeWidgetProvider

class HomeWidgetProvider : HomeWidgetProvider() {
    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray, widgetData: SharedPreferences) {
        appWidgetIds.forEach { widgetId ->
            val views = RemoteViews(context.packageName, R.layout.widget_layout).apply {
                val title = widgetData.getString("widget_title", "My Prayer Tower")
                val content = widgetData.getString("widget_content", "Peace be with you.")
                val subtext = widgetData.getString("widget_subtext", "")

                setTextViewText(R.id.widget_title, title)
                setTextViewText(R.id.widget_content, content)
                setTextViewText(R.id.widget_subtext, subtext)
            }
            appWidgetManager.updateAppWidget(widgetId, views)
        }
    }
}
