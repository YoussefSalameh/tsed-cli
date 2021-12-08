import {DIConfigurationOptions, InjectorService} from "@tsed/di";
import {Logger} from "@tsed/logger";
import {CliConfiguration} from "../services/CliConfiguration";
import {ProjectPackageJson} from "../services/ProjectPackageJson";

let logger: Logger;

export function getLogger() {
  return logger;
}

function createConfiguration(injector: InjectorService): CliConfiguration & TsED.Configuration {
  injector.addProvider(CliConfiguration);

  return injector.invoke<CliConfiguration & TsED.Configuration>(CliConfiguration);
}

function createProjectPackageJson(injector: InjectorService): ProjectPackageJson {
  injector.addProvider(ProjectPackageJson);

  return injector.invoke<ProjectPackageJson>(ProjectPackageJson);
}

export function createInjector(settings: Partial<DIConfigurationOptions> = {}) {
  const injector = new InjectorService();
  injector.settings = createConfiguration(injector);
  logger = injector.logger = new Logger(settings.name || "CLI");

  createProjectPackageJson(injector);

  injector.settings.set(settings);

  /* istanbul ignore next */
  if (injector.settings.env === "test") {
    injector.logger.stop();
  } else {
    /* istanbul ignore next */
    injector.logger.level = injector.settings.logger?.level || "error";
  }

  return injector;
}
