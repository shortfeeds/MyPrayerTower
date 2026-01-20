import 'package:flutter/material.dart';

/// Responsive layout utility for handling different screen sizes
class ResponsiveLayout extends StatelessWidget {
  final Widget mobile;
  final Widget? tablet;
  final Widget? desktop;

  const ResponsiveLayout({
    super.key,
    required this.mobile,
    this.tablet,
    this.desktop,
  });

  // Screen size breakpoints
  static const double mobileMaxWidth = 600;
  static const double tabletMaxWidth = 1024;

  static bool isMobile(BuildContext context) =>
      MediaQuery.of(context).size.width < mobileMaxWidth;

  static bool isTablet(BuildContext context) =>
      MediaQuery.of(context).size.width >= mobileMaxWidth &&
      MediaQuery.of(context).size.width < tabletMaxWidth;

  static bool isDesktop(BuildContext context) =>
      MediaQuery.of(context).size.width >= tabletMaxWidth;

  /// Returns the appropriate column count for grids based on screen size
  static int getGridColumns(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width >= tabletMaxWidth) return 4;
    if (width >= mobileMaxWidth) return 3;
    return 2;
  }

  /// Returns appropriate horizontal padding based on screen size
  static double getHorizontalPadding(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width >= tabletMaxWidth) return 48;
    if (width >= mobileMaxWidth) return 32;
    return 16;
  }

  /// Returns appropriate card aspect ratio based on screen size
  static double getCardAspectRatio(BuildContext context) {
    if (isDesktop(context)) return 1.2;
    if (isTablet(context)) return 1.1;
    return 0.9;
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth >= tabletMaxWidth) {
          return desktop ?? tablet ?? mobile;
        } else if (constraints.maxWidth >= mobileMaxWidth) {
          return tablet ?? mobile;
        } else {
          return mobile;
        }
      },
    );
  }
}

/// Extension on BuildContext for easy access to responsive utilities
extension ResponsiveContext on BuildContext {
  bool get isMobile => ResponsiveLayout.isMobile(this);
  bool get isTablet => ResponsiveLayout.isTablet(this);
  bool get isDesktop => ResponsiveLayout.isDesktop(this);
  int get gridColumns => ResponsiveLayout.getGridColumns(this);
  double get horizontalPadding => ResponsiveLayout.getHorizontalPadding(this);
  double get cardAspectRatio => ResponsiveLayout.getCardAspectRatio(this);
}

/// A flexible container that adapts to screen size
class ResponsiveContainer extends StatelessWidget {
  final Widget child;
  final double maxWidth;
  final EdgeInsetsGeometry? padding;

  const ResponsiveContainer({
    super.key,
    required this.child,
    this.maxWidth = 1200,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: maxWidth),
        child: Padding(
          padding:
              padding ??
              EdgeInsets.symmetric(horizontal: context.horizontalPadding),
          child: child,
        ),
      ),
    );
  }
}

/// A responsive grid view that adjusts columns based on screen size
class ResponsiveGrid extends StatelessWidget {
  final List<Widget> children;
  final double spacing;
  final double runSpacing;
  final int? minColumns;
  final int? maxColumns;

  const ResponsiveGrid({
    super.key,
    required this.children,
    this.spacing = 16,
    this.runSpacing = 16,
    this.minColumns,
    this.maxColumns,
  });

  @override
  Widget build(BuildContext context) {
    int columns = context.gridColumns;
    if (minColumns != null && columns < minColumns!) columns = minColumns!;
    if (maxColumns != null && columns > maxColumns!) columns = maxColumns!;

    return LayoutBuilder(
      builder: (context, constraints) {
        final itemWidth =
            (constraints.maxWidth - (spacing * (columns - 1))) / columns;

        return Wrap(
          spacing: spacing,
          runSpacing: runSpacing,
          children: children
              .map((child) => SizedBox(width: itemWidth, child: child))
              .toList(),
        );
      },
    );
  }
}
