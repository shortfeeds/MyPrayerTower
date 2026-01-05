import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/animations/premium_animations.dart';
import '../../../core/theme/app_theme.dart';
import '../../saints/providers/saints_provider.dart';

class SaintOfDayCard extends ConsumerWidget {
  const SaintOfDayCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final saintAsync = ref.watch(saintOfTheDayProvider);

    return saintAsync.when(
      data: (saint) => FadeInSlideUp(
        delay: const Duration(milliseconds: 100),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxHeight: 260),
          child: Container(
            decoration: AppTheme.sacredCardDecoration,
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () => context.push('/saints/${saint.id}'),
                borderRadius: BorderRadius.circular(16),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (saint.imageUrl != null)
                      ClipRRect(
                        borderRadius: const BorderRadius.vertical(
                          top: Radius.circular(16),
                        ),
                        child: Stack(
                          children: [
                            CachedNetworkImage(
                              imageUrl: saint.imageUrl!,
                              height: 130,
                              width: double.infinity,
                              fit: BoxFit.cover,
                              placeholder: (context, url) => PremiumShimmer(
                                child: Container(color: AppTheme.sacredNavy800),
                              ),
                              errorWidget: (context, url, error) => Container(
                                height: 130,
                                color: AppTheme.sacredNavy800,
                                child: const Center(
                                  child: Icon(
                                    LucideIcons.image,
                                    color: AppTheme.textMuted,
                                  ),
                                ),
                              ),
                            ),
                            Positioned.fill(
                              child: Container(
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topCenter,
                                    end: Alignment.bottomCenter,
                                    colors: [
                                      Colors.transparent,
                                      Colors.black.withValues(alpha: 0.3),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                            Positioned(
                              top: 10,
                              right: 10,
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 4,
                                ),
                                decoration: BoxDecoration(
                                  color: AppTheme.gold500,
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Text(
                                  'Saint of the Day',
                                  style: GoogleFonts.inter(
                                    fontSize: 9,
                                    fontWeight: FontWeight.bold,
                                    color: AppTheme.sacredNavy900,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.all(14),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              saint.name,
                              style: GoogleFonts.merriweather(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.textPrimary,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            if (saint.title != null) ...[
                              const SizedBox(height: 2),
                              Text(
                                saint.title!,
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  color: AppTheme.gold400,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                            const SizedBox(height: 6),
                            Expanded(
                              child: Text(
                                saint.shortDescription ?? saint.bio ?? '',
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  color: AppTheme.textSecondary,
                                  height: 1.4,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
      loading: () => PremiumShimmer(
        child: Container(
          height: 260,
          decoration: BoxDecoration(
            color: AppTheme.sacredNavy900,
            borderRadius: BorderRadius.circular(16),
          ),
        ),
      ),
      error: (err, stack) => const SizedBox.shrink(),
    );
  }
}
