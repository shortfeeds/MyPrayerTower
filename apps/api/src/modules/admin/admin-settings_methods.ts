
    // Settings
    async getSettings() {
    let settings = await this.prisma.appSettings.findUnique({
        where: { id: 'app_settings' }
    });

    if (!settings) {
        settings = await this.prisma.appSettings.create({
            data: { id: 'app_settings' }
        });
    }
    return settings;
}

    async updateSettings(data: any) {
    return this.prisma.appSettings.update({
        where: { id: 'app_settings' },
        data
    });
}
