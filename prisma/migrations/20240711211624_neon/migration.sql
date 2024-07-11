-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "siteName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pdf" (
    "id" SERIAL NOT NULL,
    "reportId" INTEGER NOT NULL,
    "pdfUrlMobile" TEXT NOT NULL,
    "pdfUrlDesktop" TEXT NOT NULL,

    CONSTRAINT "Pdf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesktopPerformanceScore" (
    "id" SERIAL NOT NULL,
    "reportId" INTEGER NOT NULL,
    "performance" INTEGER NOT NULL,
    "seo" INTEGER NOT NULL,
    "bestpractices" INTEGER NOT NULL,
    "accessibility" INTEGER NOT NULL,

    CONSTRAINT "DesktopPerformanceScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobilePerformanceScore" (
    "id" SERIAL NOT NULL,
    "reportId" INTEGER NOT NULL,
    "performance" INTEGER NOT NULL,
    "seo" INTEGER NOT NULL,
    "bestpractices" INTEGER NOT NULL,
    "accessibility" INTEGER NOT NULL,

    CONSTRAINT "MobilePerformanceScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pdf" ADD CONSTRAINT "Pdf_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesktopPerformanceScore" ADD CONSTRAINT "DesktopPerformanceScore_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MobilePerformanceScore" ADD CONSTRAINT "MobilePerformanceScore_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
