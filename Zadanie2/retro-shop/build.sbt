name := "retro-pc-shop"
version := "1.0-SNAPSHOT"

scalaVersion := "3.3.0"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

libraryDependencies ++= Seq(
  guice,
  "org.scalatestplus.play" %% "scalatestplus-play" % "7.0.0" % Test
)
