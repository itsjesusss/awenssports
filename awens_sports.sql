-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-12-2025 a las 22:52:35
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `awens_sports`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL,
  `codigo_seguimiento` varchar(20) NOT NULL,
  `gama` varchar(50) NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `talla` varchar(10) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `tallas_json` text DEFAULT NULL,
  `nombre_cliente` varchar(100) NOT NULL,
  `telefono_cliente` varchar(20) NOT NULL,
  `email_cliente` varchar(100) NOT NULL,
  `direccion_cliente` text NOT NULL,
  `nombre_equipo` varchar(100) NOT NULL,
  `categoria_equipo` varchar(100) NOT NULL,
  `colores_equipo` varchar(255) NOT NULL,
  `idea_uniforme` text NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `estado` enum('revision','aprobado','proceso','completado') DEFAULT 'revision',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `codigo_seguimiento`, `gama`, `tipo`, `talla`, `cantidad`, `tallas_json`, `nombre_cliente`, `telefono_cliente`, `email_cliente`, `direccion_cliente`, `nombre_equipo`, `categoria_equipo`, `colores_equipo`, `idea_uniforme`, `total`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'AWS-234367', 'Básica', 'adulto', 'S', 10, '{\"XS\":0,\"S\":5,\"M\":0,\"L\":5,\"XL\":0,\"XXL\":0}', 'José De Jesús Bocanegra', '4463989999', 'jesssuss1505@gmail.com', 'xddddddd', 'Cebestias F.C', 'Talacheros FC PANTOJA', 'Azul, Rojo', 'xddddddddd', 259.90, 'aprobado', '2025-12-01 19:38:16', '2025-12-01 19:50:46');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo_seguimiento` (`codigo_seguimiento`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_fecha_creacion` (`fecha_creacion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
