import { EponsPatientReportPage } from './app.po';

describe('epons-patient-report App', () => {
  let page: EponsPatientReportPage;

  beforeEach(() => {
    page = new EponsPatientReportPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
